<?php
/**
 * TellyFilmy Post Save Handler
 * Saves new/updated/deleted posts to posts.json on the Hostinger server
 * Called by the admin panel when publishing/editing/deleting articles
 */

// ─── CONFIG ────────────────────────────────────────────────────────────────
define('UPLOAD_SECRET', 'tellyfilmy_upload_2024'); // Must match image-input.tsx and actions.ts
define('POSTS_FILE', __DIR__ . '/posts.json');
// ───────────────────────────────────────────────────────────────────────────

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'https://www.tellyfilmy.com',
    'https://tellyfilmy.com',
    'http://localhost:3000',
    'http://localhost:9002'
];
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://www.tellyfilmy.com');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Upload-Secret');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verify secret
$secret = $_SERVER['HTTP_X_UPLOAD_SECRET'] ?? '';
if ($secret !== UPLOAD_SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Read body
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$action = $data['action']; // 'add' | 'update' | 'delete'

// Read existing posts
$posts = [];
if (file_exists(POSTS_FILE)) {
    $raw = file_get_contents(POSTS_FILE);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $posts = $decoded;
    }
}

if ($action === 'add') {
    $post = $data['post'] ?? null;
    if (!$post || !isset($post['slug'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing post data']);
        exit;
    }
    // Remove existing post with same slug (prevent duplicates)
    $posts = array_values(array_filter($posts, fn($p) => $p['slug'] !== $post['slug']));
    // Add new post at beginning
    array_unshift($posts, $post);

} elseif ($action === 'update') {
    $slug = $data['slug'] ?? null;
    $updates = $data['post'] ?? null;
    if (!$slug || !$updates) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing slug or post data']);
        exit;
    }
    $found = false;
    foreach ($posts as &$p) {
        if ($p['slug'] === $slug) {
            $p = array_merge($p, $updates);
            $found = true;
            break;
        }
    }
    unset($p);
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found: ' . $slug]);
        exit;
    }

} elseif ($action === 'delete') {
    $slug = $data['slug'] ?? null;
    if (!$slug) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing slug']);
        exit;
    }
    $posts = array_values(array_filter($posts, fn($p) => $p['slug'] !== $slug));

} else {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown action: ' . $action]);
    exit;
}

// Write back to posts.json
$written = file_put_contents(POSTS_FILE, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
if ($written === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write posts.json. Check file permissions.']);
    exit;
}

echo json_encode(['success' => true, 'count' => count($posts)]);
