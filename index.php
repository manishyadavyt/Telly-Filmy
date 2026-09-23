<?php
/**
 * TellyFilmy Universal Hostinger Router
 * Prevents 404 errors on page refresh for static routes and executes dynamic PHP endpoints
 */

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
$uri = ltrim($uri ?? '', '/');

// If requesting save-posts.php or upload.php directly
if ($uri === 'save-posts.php' || $uri === 'upload.php') {
    $phpFiles = [
        __DIR__ . '/' . $uri,
        __DIR__ . '/public_html/' . $uri,
        __DIR__ . '/public/' . $uri,
    ];
    foreach ($phpFiles as $pf) {
        if (is_file($pf)) {
            include $pf;
            exit;
        }
    }
}

// Potential candidate paths for the requested resource
$candidates = [
    __DIR__ . '/public_html/' . $uri,
    __DIR__ . '/public_html/' . $uri . '.html',
    __DIR__ . '/public_html/' . $uri . '/index.html',
    __DIR__ . '/' . $uri,
    __DIR__ . '/' . $uri . '.html',
    __DIR__ . '/' . $uri . '/index.html',
    __DIR__ . '/out/' . $uri,
    __DIR__ . '/out/' . $uri . '.html',
];

$mimes = [
    'html' => 'text/html; charset=UTF-8',
    'css'  => 'text/css',
    'js'   => 'application/javascript',
    'json' => 'application/json',
    'png'  => 'image/png',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'webp' => 'image/webp',
    'gif'  => 'image/gif',
    'svg'  => 'image/svg+xml',
    'ico'  => 'image/x-icon',
    'xml'  => 'application/xml',
    'txt'  => 'text/plain',
];

if (!empty($uri)) {
    foreach ($candidates as $file) {
        if (is_file($file)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if ($ext === 'php') {
                include $file;
                exit;
            }
            if ($ext === 'json') {
                header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
                header('Pragma: no-cache');
            }
            if (isset($mimes[$ext])) {
                header('Content-Type: ' . $mimes[$ext]);
            }
            readfile($file);
            exit;
        }
    }
} else {
    // Empty URI -> Homepage
    $homeFiles = [
        __DIR__ . '/public_html/index.html',
        __DIR__ . '/index.html',
        __DIR__ . '/out/index.html',
    ];
    foreach ($homeFiles as $home) {
        if (is_file($home)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($home);
            exit;
        }
    }
}

// 404 Fallback
http_response_code(404);
$notFoundFiles = [
    __DIR__ . '/public_html/404.html',
    __DIR__ . '/404.html',
    __DIR__ . '/out/404.html',
];
foreach ($notFoundFiles as $notFound) {
    if (is_file($notFound)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($notFound);
        exit;
    }
}

echo "<h1>404 - Page Not Found</h1>";
