# ============================================================
#  Descarga de referencias NUEVAS
#  19 oct 2026
#
#  No reemplaza a bajar-referencias-v3.ps1: aquel tiene la lista
#  de octubre adentro y queda como registro. Este lee las URLs
#  de un archivo aparte, para no tener que tocar el script cada
#  vez que se suma una tanda.
#
#  Como correrlo:
#    powershell -ExecutionPolicy Bypass -File "D:\ESPACIO-REMOTION\assets\referencias\bajar-nuevas.ps1"
#
#  Lee _nuevas.txt. Una linea por video:
#      carpeta|cuenta|url
#  Las lineas que empiezan con # se ignoran.
#
#  Crea una subcarpeta por molde. Si se corre dos veces, saltea
#  lo que ya bajo. Lo que falle queda en _fallidos-nuevas.txt
# ============================================================

$base = $PSScriptRoot
if ([string]::IsNullOrEmpty($base)) { $base = (Get-Location).Path }
$ytdlp = Join-Path $base "yt-dlp.exe"
$lista = Join-Path $base "_nuevas.txt"
$logFallidos = Join-Path $base "_fallidos-nuevas.txt"

if (-not (Test-Path $ytdlp)) {
  Write-Host "Falta yt-dlp.exe en esta carpeta. Corré primero bajar-referencias-v3.ps1, que lo baja." -ForegroundColor Red
  exit 1
}
if (-not (Test-Path $lista)) {
  Write-Host "Falta _nuevas.txt. Poné ahí las URLs, una por línea: carpeta|cuenta|url" -ForegroundColor Red
  exit 1
}

# yt-dlp se actualiza solo antes de empezar: TikTok cambia seguido y una
# version vieja falla con errores que no dicen nada
Write-Host "Actualizando yt-dlp..." -ForegroundColor Cyan
& $ytdlp -U 2>&1 | Select-Object -Last 1

if (Test-Path $logFallidos) { Remove-Item $logFallidos }

$lineas = Get-Content $lista | Where-Object { $_.Trim() -ne "" -and -not $_.Trim().StartsWith("#") }
$ok = 0; $saltados = 0; $fallos = 0

foreach ($linea in $lineas) {
  $partes = $linea.Split("|")
  if ($partes.Count -lt 3) {
    Write-Host "Línea mal formada, se saltea: $linea" -ForegroundColor Yellow
    continue
  }
  $carpeta = $partes[0].Trim()
  $cuenta = $partes[1].Trim()
  $url = $partes[2].Trim()

  $destino = Join-Path $base $carpeta
  if (-not (Test-Path $destino)) { New-Item -ItemType Directory -Path $destino | Out-Null }

  $id = ($url -split "/")[-1] -replace "\?.*$", ""
  $nombre = "$cuenta-$id"
  $yaEsta = Get-ChildItem -Path $destino -Filter "$nombre.*" -ErrorAction SilentlyContinue
  if ($yaEsta) {
    Write-Host "ya estaba: $carpeta/$nombre" -ForegroundColor DarkGray
    $saltados++
    continue
  }

  # Los posteos de fotos de TikTok (/photo/) no los soporta yt-dlp: hay que
  # guardar las imágenes a mano desde el navegador. Es lo que dejó a
  # 09-carrusel sin material en la tanda de octubre.
  if ($url -match "/photo/") {
    Write-Host "posteo de FOTOS, hay que bajarlo a mano: $url" -ForegroundColor Yellow
    "$carpeta | $nombre | posteo de fotos, yt-dlp no lo soporta | $url" | Add-Content $logFallidos
    $fallos++
    continue
  }

  Write-Host "bajando: $carpeta/$nombre" -ForegroundColor Cyan
  $salida = & $ytdlp --no-warnings -o (Join-Path $destino "$nombre.%(ext)s") $url 2>&1
  if ($LASTEXITCODE -eq 0) {
    $ok++
  } else {
    $motivo = ($salida | Out-String).Trim() -replace "`r`n", " / "
    if ($motivo.Length -gt 220) { $motivo = $motivo.Substring(0, 220) }
    "$carpeta | $nombre | $motivo | $url" | Add-Content $logFallidos
    Write-Host "  falló" -ForegroundColor Red
    $fallos++
  }
}

Write-Host ""
Write-Host "Listo. Bajados: $ok   Ya estaban: $saltados   Fallaron: $fallos" -ForegroundColor Green
if ($fallos -gt 0) { Write-Host "Los que fallaron quedaron en _fallidos-nuevas.txt" -ForegroundColor Yellow }
