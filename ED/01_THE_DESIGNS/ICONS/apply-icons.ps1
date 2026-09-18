<#
  apply-icons.ps1 - deploy icons per assignments.json (idempotent + resumable).
  - Skips Copy when the target icon.ico already matches (hash check) so
    re-runs never hit Explorer's memory-mapped lock.
  - Each node is its own try/catch: one locked folder can't abort the rest.
  - Sets folder ReadOnly + desktop.ini (Hidden,System) + icon.ico
    (Hidden,System) and keeps the folder's own previous attributes.

  Usage: powershell -ExecutionPolicy Bypass -File apply-icons.ps1 [-Root C:\...]
#>
[CmdletBinding()]
param([string]$Root = "")

$ErrorActionPreference = "Stop"
$iconsDir = Split-Path -Parent $PSCommandPath
$designs  = Split-Path -Parent $iconsDir
$ed       = Split-Path -Parent $designs
if ([string]::IsNullOrEmpty($Root)) { $Root = Split-Path -Parent $ed }

$icoDir  = Join-Path $iconsDir "ico"
$data    = Get-Content -LiteralPath (Join-Path $iconsDir "assignments.json") -Raw | ConvertFrom-Json
$iniText = "[.ShellClassInfo]`r`nIconResource=icon.ico,0`r`n"

$applied = 0
$warned  = 0
foreach ($a in $data.assignments) {
  $rel = $a.path -replace '/', '\'
  $folder = if ($rel -eq '.') { $Root } else { Join-Path $Root $rel }
  if (-not (Test-Path -LiteralPath $folder -PathType Container)) {
    Write-Warning ("MISSING folder (skipped): {0}" -f $a.path); $warned++; continue
  }
  $srcIco = Join-Path $icoDir (($a.icon -replace '^([0-9]+)_(seedling|gem|streams|blueprint|compass|key|star|ticket|logbook|calendar|film|broadcast|heart|chalk|dice|flame|crown|wheel|pillar|shard|stack|leaf|anvil|telescope|map|vault|crate|orb|tome|gear|tombstone|stone)$', '$2') + ".ico")
  if (-not (Test-Path -LiteralPath $srcIco)) {
    Write-Warning ("MISSING icon asset ({0}) for {1}" -f $a.icon, $a.path); $warned++; continue
  }

  try {
    $destIco = Join-Path $folder "icon.ico"
    $needCopy = -not (Test-Path -LiteralPath $destIco)
    if (-not $needCopy) {
      $hCur = (Get-FileHash -LiteralPath $destIco -Algorithm SHA256).Hash
      $hSrc = (Get-FileHash -LiteralPath $srcIco -Algorithm SHA256).Hash
      $needCopy = $hCur -ne $hSrc
    }
    if ($needCopy) {
      Copy-Item -LiteralPath $srcIco -Destination $destIco -Force
    }
    $ico = Get-Item -LiteralPath $destIco -Force
    $ico.Attributes = $ico.Attributes -bor [System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::System

    $iniPath = Join-Path $folder "desktop.ini"
    Set-Content -LiteralPath $iniPath -Value $iniText -Encoding ASCII -NoNewline
    $ini = Get-Item -LiteralPath $iniPath -Force
    $ini.Attributes = $ini.Attributes -bor [System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::System

    $dirNode = Get-Item -LiteralPath $folder -Force
    $dirNode.Attributes = $dirNode.Attributes -bor [System.IO.FileAttributes]::ReadOnly

    $applied++
  } catch {
    Write-Warning ("FAILED (continued): {0} -> {1}" -f $a.path, $_.Exception.Message); $warned++
  }
}

Write-Host ""
Write-Host ("ICONS APPLIED - {0} folder(s) configured; {1} warning(s)." -f $applied, $warned)
Write-Host "Tip: custom folder glyphs can't be refreshed while the folder icon is"
Write-Host "open in Explorer. Close the folder window, then rerun - the hash check"
Write-Host "skips identical files and only the changed desktop.ini gets rewritten."
Start-Process -FilePath "ie4uinit.exe" -ArgumentList "-show" -NoNewWindow -Wait -ErrorAction SilentlyContinue