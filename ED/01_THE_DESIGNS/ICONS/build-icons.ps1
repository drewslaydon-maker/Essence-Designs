<#
  build-icons.ps1 - ESSENCE DESIGNS icon generator (zero external deps).
  Renders ED/01_THE_DESIGNS/ICONS/icons.json to multi-size PNG-in-ICO files
  using WPF (System.Windows.Media). No ImageMagick / Inkscape / Node involved.

  Usage:  powershell -ExecutionPolicy Bypass -File build-icons.ps1
#>
[CmdletBinding()]
param(
  [string]$SourceDir = ""
)

$ErrorActionPreference = "Stop"
if ([string]::IsNullOrEmpty($SourceDir)) { $SourceDir = Split-Path -Parent $PSCommandPath }
Add-Type -AssemblyName PresentationCore, WindowsBase

$jsonPath = Join-Path $SourceDir "icons.json"
$outDir   = Join-Path $SourceDir "ico"
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$data  = Get-Content -LiteralPath $jsonPath -Raw | ConvertFrom-Json
$tones = @{}
foreach ($p in $data.tones.PSObject.Properties) { $tones[$p.Name] = $p.Value }
$onGold = $data.glyphOnGold
$onDark = $data.glyphOnDark

$sizes = @(16, 24, 32, 48, 64, 128, 256)

function New-Brush([string]$hex) {
  $c = [System.Windows.Media.ColorConverter]::ConvertFromString($hex)
  $b = New-Object System.Windows.Media.SolidColorBrush($c)
  $b.Freeze()
  return $b
}

function New-IconPng([object]$icon, [int]$size, [hashtable]$tones, [string]$onGold, [string]$onDark) {
  $scale = [double]$size / 24.0
  $bg    = New-Brush $tones[$icon.tone]
  $isGold = ($icon.tone -eq "gold")
  $fg    = New-Brush $(if ($isGold) { $onGold } else { $onDark })

  $pen = New-Object System.Windows.Media.Pen($fg, 1.7)
  $pen.StartLineCap = [System.Windows.Media.PenLineCap]::Round
  $pen.EndLineCap   = [System.Windows.Media.PenLineCap]::Round
  $pen.LineJoin     = [System.Windows.Media.PenLineJoin]::Round
  $pen.Freeze()

  $dv = New-Object System.Windows.Media.DrawingVisual
  $dc = $dv.RenderOpen()
  $dc.PushTransform((New-Object System.Windows.Media.ScaleTransform($scale, $scale)))
  $rect = New-Object System.Windows.Rect(0, 0, 24, 24)
  $dc.DrawRoundedRectangle($bg, $null, $rect, 5.0, 5.0)

  foreach ($p in $icon.g) {
    switch ($p.t) {
      "path" {
        $geo = [System.Windows.Media.Geometry]::Parse($p.d)
        $dc.DrawGeometry($null, $pen, $geo)
      }
      "circle" {
        if ($p.fill) { $dc.DrawEllipse($fg, $null, (New-Object System.Windows.Point($p.cx, $p.cy)), $p.r, $p.r) }
        else         { $dc.DrawEllipse($null, $pen, (New-Object System.Windows.Point($p.cx, $p.cy)), $p.r, $p.r) }
      }
      "rect" {
        $r = New-Object System.Windows.Rect($p.x, $p.y, $p.w, $p.h)
        if ($p.r -gt 0) { $dc.DrawRoundedRectangle($null, $pen, $r, $p.r, $p.r) }
        else            { $dc.DrawRectangle($null, $pen, $r) }
      }
    }
  }
  $dc.Close()

  $rt = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($size, $size, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
  $rt.Render($dv)
  $enc = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
  $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rt))
  $ms = New-Object System.IO.MemoryStream
  $enc.Save($ms)
  return ,$ms.ToArray()
}

function Export-Ico([string]$path, [byte[][]]$frames, [int[]]$frameSizes) {
  $count = $frames.Count
  $ms = New-Object System.IO.MemoryStream
  $bw = New-Object System.IO.BinaryWriter($ms)
  $bw.Write([UInt16]0)          # reserved
  $bw.Write([UInt16]1)          # type = icon
  $bw.Write([UInt16]$count)     # image count
  $offset = 6 + (16 * $count)
  for ($i = 0; $i -lt $count; $i++) {
    $s = $frameSizes[$i]
    $dim = if ($s -ge 256) { 0 } else { $s }
    $bw.Write([byte]$dim)       # width
    $bw.Write([byte]$dim)       # height
    $bw.Write([byte]0)          # palette
    $bw.Write([byte]0)          # reserved
    $bw.Write([UInt16]1)        # planes
    $bw.Write([UInt16]32)       # bpp
    $bw.Write([UInt32]$frames[$i].Length)
    $bw.Write([UInt32]$offset)
    $offset += $frames[$i].Length
  }
  foreach ($f in $frames) { $bw.Write($f) }
  $bw.Flush()
  [System.IO.File]::WriteAllBytes($path, $ms.ToArray())
  $bw.Dispose(); $ms.Dispose()
}

$built = 0
foreach ($icon in $data.icons) {
  $frames = New-Object System.Collections.ArrayList
  foreach ($s in $sizes) { [void]$frames.Add((New-IconPng $icon $s $tones $onGold $onDark)) }
  $icoPath = Join-Path $outDir ("{0}.ico" -f $icon.id)
  Export-Ico $icoPath $frames.ToArray() $sizes
  $built++
  Write-Host ("  {0,-12} {1,7} bytes" -f $icon.id, (Get-Item -LiteralPath $icoPath).Length)
}
Write-Host ""
Write-Host ("ICONS BUILT - {0} icon(s) -> {1}" -f $built, $outDir)