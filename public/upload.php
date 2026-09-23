<?php
/**
 * TellyFilmy Image Upload Handler
 * Saves images to /uploads/ folder on Hostinger server
 * Accessible at: https://www.tellyfilmy.com/uploads/filename.jpg
 */

// ─── CONFIG ────────────────────────────────────────────────────────────────
define('UPLOAD_SECRET', 'tellyfilmy_upload_2024');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10 MB max
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', 'https://www.tellyfilmy.com/uploads/');
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
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

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verify secret key
$secret = $_SERVER['HTTP_X_UPLOAD_SECRET'] ?? $_POST['secret'] ?? '';
if ($secret !== UPLOAD_SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Check file exists
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCodes = [
        UPLOAD_ERR_INI_SIZE   => 'File too large (server limit)',
        UPLOAD_ERR_FORM_SIZE  => 'File too large (form limit)',
        UPLOAD_ERR_PARTIAL    => 'Upload was interrupted',
        UPLOAD_ERR_NO_FILE    => 'No file received',
        UPLOAD_ERR_NO_TMP_DIR => 'Server temp folder missing',
        UPLOAD_ERR_CANT_WRITE => 'Server write permission error',
        UPLOAD_ERR_EXTENSION  => 'Blocked by server extension',
    ];
    $code = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    $msg  = $errCodes[$code] ?? 'Upload error (code ' . $code . ')';
    http_response_code(400);
    echo json_encode(['error' => $msg]);
    exit;
}

$file = $_FILES['file'];

// Validate file size
if ($file['size'] > MAX_FILE_SIZE) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Maximum size is 10MB.']);
    exit;
}

// Validate MIME type using finfo
$finfo    = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, ALLOWED_TYPES, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed.']);
    exit;
}

// Build safe filename
$ext      = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'][$mimeType];
$slug     = preg_replace('/[^a-z0-9\-]/', '', strtolower($_POST['slug'] ?? 'image'));
$slug     = $slug ?: 'image';
$type     = in_array($_POST['imageType'] ?? '', ['main', 'article'], true) ? $_POST['imageType'] : 'img';
$idx      = intval($_POST['imageIndex'] ?? 0);
$ts       = time();
$filename = $slug . '-' . $type . ($idx > 0 ? '-' . $idx : '') . '-' . $ts . '.' . $ext;

// Create upload directory if needed
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Move uploaded file
$dest = UPLOAD_DIR . $filename;
if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file on server. Check folder permissions.']);
    exit;
}

// Return success with public URL
echo json_encode([
    'success'  => true,
    'url'      => UPLOAD_URL . $filename,
    'filename' => $filename,
]);
