param(
    [string]$Fate = '',
    [string]$Lore = '',
    [string]$Goal = '',
    [string]$Focus = '',
    [string]$Word = '',
    [string]$Path = 'C:\Users\Andrew\Documents\My Games\OpenMW\data_GuruLens\GuruLens\dispatch.txt',
    [string]$SessionBook = 'C:\Users\Andrew\Projects\LEGACY\VAULT\ElderScrollsGuruHelper\session\current_character.md'
)

function Get-BulletAfterHeading {
    param([string]$File, [string]$Heading)
    if (-not (Test-Path -LiteralPath $File)) { return '' }
    $lines = Get-Content -LiteralPath $File
    $start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match ('^##\s+' + [regex]::Escape($Heading))) { $start = $i + 1; break }
    }
    if ($start -lt 0) { return '' }
    for ($i = $start; $i -lt $lines.Count; $i++) {
        $m = [regex]::Match($lines[$i], '^-\s+(.*)$')
        if ($m.Success) {
            $v = $m.Groups[1].Value.Trim()
            if ($v -ne '' -and -not $v.StartsWith('<')) { return $v }
            return ''
        }
    }
    return ''
}

if ($Goal  -eq '') { $Goal  = Get-BulletAfterHeading $SessionBook 'Current SHORT-TERM goal' }
if ($Lore  -eq '') { $Lore  = Get-BulletAfterHeading $SessionBook 'Longer-term plan' }
if ($Focus -eq '') { $Focus = Get-BulletAfterHeading $SessionBook 'Build focus (chosen at creation)' }

$fields = @{}
if ($Fate  -ne '') { $fields['fate']  = $Fate }
if ($Lore  -ne '') { $fields['lore']  = $Lore }
if ($Goal  -ne '') { $fields['goal']  = $Goal }
if ($Focus -ne '') { $fields['focus'] = $Focus }
if ($Word  -ne '') { $fields['word']  = $Word }

if ($fields.Count -eq 0) {
    Write-Error 'Nothing to dispatch. Check current_character.md or pass -Goal/-Word/... explicitly.'
    exit 1
}

$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
$lines = @("stamp: $stamp")
foreach ($key in 'fate', 'lore', 'goal', 'focus', 'word') {
    if ($fields.ContainsKey($key)) {
        foreach ($line in ($fields[$key] -split "`n")) {
            $lines += "$key`:$line"
        }
    }
}

$dir = Split-Path -Parent $Path
if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

try {
    Set-Content -LiteralPath $Path -Value ($lines -join "`r`n") -Encoding UTF8 -NoNewline
} catch {
    Write-Error "Could not write $Path — is the game holding the file?"
    exit 2
}

Write-Output "Dispatched to $Path"
$source = Get-Item -LiteralPath $Path
Write-Output "Sources: session book + explicit params"
Write-Output ($lines -join "`n")