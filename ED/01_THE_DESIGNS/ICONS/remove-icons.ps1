<#
  remove-icons.ps1 - full revert of apply-icons.ps1.
  Removes desktop.ini + icon.ico from every assigned node and clears the
  ReadOnly folder attribute that apply-icons.ps1 set. Icon source assets
  (icons.json / ico/) are kept.

  Usage: powershell -ExecutionPolicy Bypass -File remove-icons.ps1
#>
[CmdletBinding()]
param([string]$Root = "")

$ErrorActionPreference = "Stop"
$iconsDir = Split-Path -Parent $PSCommandPath
$designs  = Split-Path -Parent $iconsDir
$ed       = Split-Path -Parent $designs
if ([string]::IsNullOrEmpty($Root)) { $Root = Split-Path -Parent $ed }

$data = Get-Content -LiteralPath (Join-Path $iconsDir "assignments.json") -Raw | ConvertFrom-Json

$removed = 0
foreach ($a in $data.assignments) {
  $rel = $a.path -replace '/', '\'
  $folder = if ($rel -eq '.') { $Root } else { Join-Path $Root $rel }
  if (-not (Test-Path -LiteralPath $folder -PathType Container)) { continue }

  foreach ($n in @("desktop.ini", "icon.ico")) {
    $p = Join-Path $folder $n
    if (Test-Path -LiteralPath $p) { Remove-Item -LiteralPath $p -Force; }
  }
  try {
    $dir = Get-Item -LiteralPath $folder -Force
    $dir.Attributes = $dir.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
  } catch { }

  Write-Host ("  reverted {0}" -f $a.path)
  $removed++
}

Write-Host ""
Write-Host ("ICONS REVERTED - {0} folder(s)." -f $removed)
Start-Process -FilePath "ie4uinit.exe" -ArgumentList "-show" -NoNewWindow -Wait -ErrorAction SilentlyContinue
Write-Host "Explorer icon cache refreshed."