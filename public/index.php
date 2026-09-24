<?php
/**
 * TellyFilmy Universal Dynamic Router & Fallback Handler
 * Handles dynamic routing for /posts/{slug}, /category/{category}, /admin routes
 * Serves dynamic content and client-side SPA hydration for newly published articles.
 */

// Disable all caching for dynamic route resolution
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = trim($path, '/');

// Candidate locations for posts.json
$candidateJsonPaths = [
    __DIR__ . '/posts.json',
    __DIR__ . '/public_html/posts.json',
    __DIR__ . '/public/posts.json',
    dirname(__DIR__) . '/public_html/posts.json',
    dirname(__DIR__) . '/posts.json',
];

$posts = [];
foreach ($candidateJsonPaths as $p) {
    if (file_exists($p) && is_readable($p)) {
        $raw = @file_get_contents($p);
        $decoded = @json_decode($raw, true);
        if (is_array($decoded) && count($decoded) > count($posts)) {
            $posts = $decoded;
        }
    }
}

// Check if direct static html exists
$candidateHtmlPaths = [
    __DIR__ . '/' . $path . '.html',
    __DIR__ . '/public_html/' . $path . '.html',
    __DIR__ . '/' . $path . '/index.html',
    __DIR__ . '/public_html/' . $path . '/index.html',
];

foreach ($candidateHtmlPaths as $htmlPath) {
    if (file_exists($htmlPath) && is_file($htmlPath)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($htmlPath);
        exit;
    }
}

// Locate the 404/SPA template shell
$spaShell = null;
$candidate404 = [
    __DIR__ . '/404.html',
    __DIR__ . '/public_html/404.html',
    __DIR__ . '/_not-found.html',
    __DIR__ . '/public_html/_not-found.html',
    __DIR__ . '/index.html',
    __DIR__ . '/public_html/index.html',
];

foreach ($candidate404 as $p404) {
    if (file_exists($p404) && is_file($p404)) {
        $spaShell = file_get_contents($p404);
        break;
    }
}

// If this is an admin edit route: /admin/edit/* or /admin/edit
if (preg_match('#^admin/edit(/.*)?$#', $path)) {
    $candidateEditHtml = [
        __DIR__ . '/admin/edit.html',
        __DIR__ . '/public_html/admin/edit.html',
        dirname(__DIR__) . '/public_html/admin/edit.html',
        dirname(__DIR__) . '/out/admin/edit.html',
    ];
    foreach ($candidateEditHtml as $eh) {
        if (file_exists($eh) && is_file($eh)) {
            header('HTTP/1.1 200 OK');
            header('Content-Type: text/html; charset=UTF-8');
            readfile($eh);
            exit;
        }
    }
}

// If this is a single post route: /posts/{slug}
if (preg_match('#^posts/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    $slug = $matches[1];
    $foundPost = null;
    foreach ($posts as $p) {
        if (isset($p['slug']) && $p['slug'] === $slug) {
            $foundPost = $p;
            break;
        }
    }

    if ($foundPost && $spaShell) {
        // Inject dynamic metadata into the SPA shell so SEO crawlers, WhatsApp, and browsers see real meta tags
        $title = htmlspecialchars($foundPost['metaTitle'] ?? $foundPost['title'] . ' | Telly Filmy');
        $desc = htmlspecialchars($foundPost['metaDescription'] ?? $foundPost['excerpt'] ?? '');
        $img = htmlspecialchars($foundPost['imageUrl'] ?? '/logo.png');
        if (!preg_match('#^https?://#i', $img)) {
            $img = 'https://www.tellyfilmy.com' . $img;
        }
        $postUrl = 'https://www.tellyfilmy.com/posts/' . htmlspecialchars($slug);

        $spaShell = preg_replace('#<title>.*?</title>#is', '<title>' . $title . '</title>', $spaShell, 1);
        $spaShell = preg_replace('#<meta property="og:title" content=".*?"#is', '<meta property="og:title" content="' . $title . '"', $spaShell, 1);
        $spaShell = preg_replace('#<meta property="og:description" content=".*?"#is', '<meta property="og:description" content="' . $desc . '"', $spaShell, 1);
        $spaShell = preg_replace('#<meta property="og:image" content=".*?"#is', '<meta property="og:image" content="' . $img . '"', $spaShell, 1);
        $spaShell = preg_replace('#<meta property="og:url" content=".*?"#is', '<meta property="og:url" content="' . $postUrl . '"', $spaShell, 1);

        header('HTTP/1.1 200 OK');
        header('Content-Type: text/html; charset=UTF-8');
        echo $spaShell;
        exit;
    }
}

// For all other routes, serve the SPA shell with 200 OK
if ($spaShell) {
    header('HTTP/1.1 200 OK');
    header('Content-Type: text/html; charset=UTF-8');
    echo $spaShell;
    exit;
}

// Fallback plain 404
header('HTTP/1.1 404 Not Found');
echo '<h1>404 Not Found</h1><p>The requested page could not be located.</p>';
exit;
