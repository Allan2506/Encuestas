Write-Host "=========================================="
Write-Host " CONFIGURACION DE FECHA Y HORA (ENCUESTA) "
Write-Host "=========================================="
Write-Host "1. Usar fecha y hora ACTUALES"
Write-Host "2. Ingresar fecha y hora ESPECIFICAS"
$opcion = Read-Host "Selecciona una opcion (1 o 2)"

if ($opcion -eq '2') {$dia = Read-Host "Ingresa el dia del mes (ej. 5, 14, 28)"
    $hora = Read-Host "Ingresa la hora (Formato 24h, ej. 08, 14, 21)"
    $minuto = Read-Host "Ingresa los minutos (ej. 05, 30, 45)"
    
    $env:TIEMPO_OPCION = "manual"
    $env:DIA_MANUAL =$dia
    $env:HORA_MANUAL =$hora
    $env:MINUTO_MANUAL =$minuto
} else {
    $env:TIEMPO_OPCION = "actual"
}

Write-Host "`n=========================================="
Write-Host "      SELECCION DE USUARIO (COMENTARIO)   "
Write-Host "=========================================="
Write-Host "I. Excelente calidad I"
Write-Host "B. Excelente calidad B"
$usuario = Read-Host "Selecciona el usuario (I o B)"

$env:TIPO_USUARIO = $usuario.ToUpper()
if ($env:TIPO_USUARIO -ne 'I' -and $env:TIPO_USUARIO -ne 'B') {
    Write-Host "Opcion no valida, usando B por defecto."
    $env:TIPO_USUARIO = 'B'
}

Write-Host "`n🚀 Levantando Playwright sin proxies (Conexión directa)..."
npx playwright test tests/mcd_encuesta.spec.js --workers=1