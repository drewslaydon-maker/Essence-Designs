<#
  apply-icons.ps1 - writes custom folder icons into the assigned Tier-1 nodes.
  For each node: drops a copy of the node's .ico + a hidden desktop.ini, sets
  the folder ReadOnly attribute, then refreshes the Explorer icon cache.

  Revert with: remove-icons.ps1
  Usage: powershell -ExecutionPolicy Bypass -File apply-icons.ps1
#>
[CmdletBinding()]
param([string]$Root = "")

$ErrorActionPreference = "Stop"
$iconsDir = Split-Path -Parent $PSCommandPath
$designs  = Split-Path -Parent $iconsDir
$ed       = Split-Path -Parent $designs
if ([string]::IsNullOrEmpty($Root)) { $Root = Split-Path -Parent $ed }

$icoDir = Join-Path $iconsDir "ico"
$data   = Get-Content -LiteralPath (Join-Path $iconsDir "assignments.json") -Raw | ConvertFrom-Json

$iniText = "[.ShellClassInfo]`r`nIconResource=icon.ico,0`r`n"

$applied = 0
$skipped = 0
foreach ($a in $data.assignments) {
  $rel = $a.path -replace '/', '\'
  $folder = if ($rel -eq '.') { $Root } else { Join-Path $Root $rel }
  if (-not (Test-Path -LiteralPath $folder -PathType Container)) {
    Write-Warning ("MISSING folder: {0}" -f $a.path); $skipped++; continue
  }
  $srcIco = Join-Path $icoDir ($a.icon + ".ico")
  if (-not (Test-Path -LiteralPath $srcIco)) {
    Write-Warning ("MISSING icon: {0}" -f $a.icon); $skipped++; continue
  }

  Copy-Item -LiteralPath $srcIco -Destination (Join-Path $folder "icon.ico") -Force
  $iniPath = Join-Path $folder "desktop.ini"
  Set-Content -LiteralPath $iniPath -Value $iniText -Encoding ASCII -NoNewline

  $ini = Get-Item -LiteralPath $iniPath -Force
  $ini.Attributes = $ini.Attributes -bor [System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::System

  $dir = Get-Item -LiteralPath $folder -Force
  $dir.Attributes = $dir.Attributes -bor [System.IO.FileAttributes]::ReadOnly

  Write-Host ("  {0,-52} -> {1}" -f $a.path, $a.icon)
  $applied++
}

Write-Host ""
Write-Host ("ICONS APPLIED - {0} folder(s); {1} skipped." -f $applied, $skipped)
Start-Process -FilePath "ie4uinit.exe" -ArgumentList "-show" -NoNewWindow -Wait -ErrorAction SilentlyContinue
Write-Host "Explorer icon cache refreshed."