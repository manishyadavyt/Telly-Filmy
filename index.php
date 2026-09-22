<?php
/**
 * TellyFilmy Hostinger Entry Point
 * Handles direct serving if repo is cloned directly into public_html
 */
if (file_exists(__DIR__ . '/public_html/index.html')) {
    // If request has a specific file path
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = ltrim($uri, '/');
    
    if (!empty($uri)) {
        $targetFile = __DIR__ . '/public_html/' . $uri;
        if (is_file($targetFile)) {
            // Serve static asset with appropriate mime type
            $ext = pathinfo($targetFile, PATHINFO_EXTENSION);
            $mimes = [
                'html' => 'text/html',
                'css'  => 'text/css',
                'js'   => 'application/javascript',
                'json' => 'application/json',
                'png'  => 'image/png',
                'jpg'  => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif'  => 'image/gif',
                'svg'  => 'image/svg+xml',
                'ico'  => 'image/x-icon',
                'xml'  => 'application/xml',
                'txt'  => 'text/plain',
            ];
            if (isset($mimes[$ext])) {
                header('Content-Type: ' . $mimes[$ext]);
            }
            readfile($targetFile);
            exit;
        }
        
        // Try with .html extension
        if (is_file($targetFile . '.html')) {
            header('Content-Type: text/html');
            readfile($targetFile . '.html');
            exit;
        }
    }
    
    // Default to homepage
    header('Content-Type: text/html');
    readfile(__DIR__ . '/public_html/index.html');
    exit;
}

if (file_exists(__DIR__ . '/index.html')) {
    header('Content-Type: text/html');
    readfile(__DIR__ . '/index.html');
    exit;
}

http_response_code(404);
echo "Site is being deployed. Please refresh in a moment.";
