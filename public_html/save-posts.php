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

} elseif ($action === 'sync_all' || $action === 'batch_add') {
    $batchPosts = $data['posts'] ?? [];
    if (is_array($batchPosts) && count($batchPosts) > 0) {
        foreach (array_reverse($batchPosts) as $bp) {
            if (isset($bp['slug']) && !empty($bp['slug'])) {
                $posts = array_values(array_filter($posts, fn($p) => isset($p['slug']) && $p['slug'] !== $bp['slug']));
                array_unshift($posts, $bp);
            }
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown action: ' . $action]);
    exit;
}

// Purge LiteSpeed server cache so all devices and CDN edges get the new content immediately
header('X-LiteSpeed-Purge: *');

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

// Locate template shell to generate static HTML for the post
$postSlug = ($action === 'add' ? ($data['post']['slug'] ?? null) : ($data['post']['slug'] ?? $data['slug'] ?? null));
if ($postSlug) {
    $candidate404 = [
        __DIR__ . '/404.html',
        __DIR__ . '/public_html/404.html',
        dirname(__DIR__) . '/public_html/404.html',
        dirname(__DIR__) . '/out/404.html',
    ];
    $shell = null;
    foreach ($candidate404 as $p404) {
        if (file_exists($p404) && is_file($p404)) {
            $shell = file_get_contents($p404);
            break;
        }
    }

    if ($shell && $action !== 'delete') {
        $postData = ($action === 'add' ? $data['post'] : array_merge($data['post'] ?? [], ['slug' => $postSlug]));
        $title = htmlspecialchars($postData['metaTitle'] ?? $postData['title'] ?? 'Article') . ' | Telly Filmy';
        $desc = htmlspecialchars($postData['metaDescription'] ?? $postData['excerpt'] ?? '');
        $img = htmlspecialchars($postData['imageUrl'] ?? '/logo.png');
        if (!preg_match('#^https?://#i', $img)) {
            $img = 'https://www.tellyfilmy.com' . $img;
        }
        $postUrl = 'https://www.tellyfilmy.com/posts/' . htmlspecialchars($postSlug);

        $customHtml = preg_replace('#<title>.*?</title>#is', '<title>' . $title . '</title>', $shell, 1);
        $customHtml = preg_replace('#<meta property="og:title" content=".*?"#is', '<meta property="og:title" content="' . $title . '"', $customHtml, 1);
        $customHtml = preg_replace('#<meta property="og:description" content=".*?"#is', '<meta property="og:description" content="' . $desc . '"', $customHtml, 1);
        $customHtml = preg_replace('#<meta property="og:image" content=".*?"#is', '<meta property="og:image" content="' . $img . '"', $customHtml, 1);
        $customHtml = preg_replace('#<meta property="og:url" content=".*?"#is', '<meta property="og:url" content="' . $postUrl . '"', $customHtml, 1);

        $postDirs = [
            __DIR__ . '/posts',
            __DIR__ . '/public_html/posts',
            dirname(__DIR__) . '/public_html/posts',
            dirname(__DIR__) . '/posts'
        ];
        foreach ($postDirs as $pd) {
            if (is_dir($pd)) {
                @file_put_contents($pd . '/' . $postSlug . '.html', $customHtml);
                @chmod($pd . '/' . $postSlug . '.html', 0666);
            }
        }
    } elseif ($action === 'delete') {
        $postDirs = [
            __DIR__ . '/posts',
            __DIR__ . '/public_html/posts',
            dirname(__DIR__) . '/public_html/posts',
            dirname(__DIR__) . '/posts'
        ];
        foreach ($postDirs as $pd) {
            if (is_dir($pd)) {
                @unlink($pd . '/' . $postSlug . '.html');
            }
        }
    }
}

echo json_encode(['success' => true, 'count' => count($posts), 'synced_files' => $successCount]);
