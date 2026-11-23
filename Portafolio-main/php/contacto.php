<?php
header('Content-Type: application/json; charset=utf-8');
$para = 'hirohitotarazonaquispe@gmail.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
if (!empty($_POST['web'])) { echo json_encode(['ok' => true]); exit; } 

$limpio = fn($v) => trim(preg_replace('/[\r\n]+/', ' ', strip_tags($v ?? '')));
$nombre = $limpio($_POST['nombre'] ?? ''); $telefono = $limpio($_POST['telefono'] ?? '');
$correo = trim($_POST['correo'] ?? ''); $mensaje = trim(strip_tags($_POST['mensaje'] ?? ''));

if ($nombre === '' || $mensaje === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo json_encode(['ok' => false, 'msg' => 'Datos inválidos']); exit;
}
$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST']);
$cabeceras = "From: Portafolio <noreply@$host>\r\nReply-To: $correo\r\nContent-Type: text/plain; charset=UTF-8";
$asunto = '=?UTF-8?B?' . base64_encode("Nuevo mensaje de $nombre") . '?=';
$cuerpo = "Nombre: $nombre\nCorreo: $correo\nTeléfono: $telefono\n\nMensaje:\n$mensaje";

$ok = mail($para, $asunto, $cuerpo, $cabeceras);
if (!$ok) http_response_code(500);
echo json_encode(['ok' => $ok]);
