<?php
/**
 * TellyFilmy Universal Post Save Handler
 * Saves new/updated/deleted posts to posts.json across all server locations
 * Called by the admin panel when publishing/editing/deleting articles
 */

// ─── CONFIG ────────────────────────────────────────────────────────────────
define('UPLOAD_SECRET', 'tellyfilmy_upload_2024');

// All candidate paths for posts.json on Hostinger
$candidate_paths = [
    __DIR__ . '/posts.json',
    __DIR__ . '/public_html/posts.json',
    __DIR__ . '/public/posts.json',
    dirname(__DIR__) . '/public_html/posts.json',
    dirname(__DIR__) . '/posts.json',
    dirname(__DIR__) . '/public/posts.json',
];

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
header('Cache-Control: no-store, no-cache, must-revalidate');
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

// Find the best existing posts.json to read from
$posts = [];
foreach ($candidate_paths as $p) {
    if (file_exists($p) && is_readable($p)) {
        $raw = file_get_contents($p);
        $decoded = json_decode($raw, true);
        if (is_array($decoded) && count($decoded) > count($posts)) {
            $posts = $decoded;
        }
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
    $posts = array_values(array_filter($posts, fn($p) => isset($p['slug']) && $p['slug'] !== $post['slug']));
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
    $targetSlug = $updates['slug'] ?? $slug;
    $found = false;
    foreach ($posts as &$p) {
        if (isset($p['slug']) && ($p['slug'] === $slug || $p['slug'] === $targetSlug)) {
            $p = array_merge($p, $updates);
            $found = true;
            break;
        }
    }
    unset($p);

    // If not found in posts.json (e.g. was a static build post), upsert it!
    if (!$found) {
        $newPost = array_merge([
            'id' => $targetSlug,
            'slug' => $targetSlug,
            'date' => date('c'),
            'author' => ['name' => 'TellyFilmy', 'avatarUrl' => '/logo.png'],
            'views' => 0
        ], $updates);
        array_unshift($posts, $newPost);
    }

} elseif ($action === 'delete') {
    $slug = $data['slug'] ?? null;
    if (!$slug) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing slug']);
        exit;
    }
    $posts = array_values(array_filter($posts, fn($p) => isset($p['slug']) && $p['slug'] !== $slug));

} else {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown action: ' . $action]);
    exit;
}

// Write back to ALL existing candidate paths
$jsonContent = json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$successCount = 0;

foreach ($candidate_paths as $p) {
    $dir = dirname($p);
    if (is_dir($dir)) {
        $w = @file_put_contents($p, $jsonContent);
        if ($w !== false) {
            @chmod($p, 0666);
            $successCount++;
        }
    }
}

if ($successCount === 0) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write posts.json. Please check server folder write permissions.']);
    exit;
}

echo json_encode(['success' => true, 'count' => count($posts), 'synced_files' => $successCount]);
