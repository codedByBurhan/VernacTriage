Add-Type -AssemblyName System.Drawing

$img2Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405343267.png"
$bmp2 = [System.Drawing.Bitmap]::FromFile($img2Path)
$bgR2 = 18; $bgG2 = 17; $bgB2 = 30

function IsForeground($c, $bgR, $bgG, $bgB, $threshold) {
    $diff = [Math]::Abs($c.R - $bgR) + [Math]::Abs($c.G - $bgG) + [Math]::Abs($c.B - $bgB)
    return $diff -gt $threshold
}

# Bounds of Transformation visual (y: 0 to 150)
$minX = 999; $maxX = 0; $minY = 999; $maxY = 0
for ($x = 0; $x -lt $bmp2.Width; $x++) {
    for ($y = 0; $y -lt 150; $y++) {
        if (IsForeground ($bmp2.GetPixel($x, $y)) $bgR2 $bgG2 $bgB2 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Output "Transformation Visual bounds: X=[$minX, $maxX], Y=[$minY, $maxY], Size: $($maxX-$minX+1)x$($maxY-$minY+1)"

# Analyze columns in bottom area (y: 170 to bmp2.Height) to separate the 3 icons
$colsBottom = @()
for ($x = 0; $x -lt $bmp2.Width; $x++) {
    $fgCount = 0
    for ($y = 170; $y -lt $bmp2.Height; $y++) {
        if (IsForeground ($bmp2.GetPixel($x, $y)) $bgR2 $bgG2 $bgB2 25) {
            $fgCount++
        }
    }
    $colsBottom += $fgCount
}

# Find columns where there is a gap between icons
# Icon 1 (Homograph Collision): roughly x=0 to x=130
# Icon 2 (Deterministic Audit): roughly x=130 to x=260
# Icon 3 (Phonetic Ear-Spelling): roughly x=260 to x=387

function GetBoundsInBox($bmp, $startX, $endX, $startY, $endY, $bgR, $bgG, $bgB) {
    $bMinX = 999; $bMaxX = 0; $bMinY = 999; $bMaxY = 0
    for ($x = $startX; $x -le $endX; $x++) {
        for ($y = $startY; $y -le $endY; $y++) {
            if (IsForeground ($bmp.GetPixel($x, $y)) $bgR $bgG $bgB 25) {
                if ($x -lt $bMinX) { $bMinX = $x }
                if ($x -gt $bMaxX) { $bMaxX = $x }
                if ($y -lt $bMinY) { $bMinY = $y }
                if ($y -gt $bMaxY) { $bMaxY = $y }
            }
        }
    }
    return "$bMinX, $bMaxX, $bMinY, $bMaxY (Size: $($bMaxX-$bMinX+1)x$($bMaxY-$bMinY+1))"
}

# Just the symbol (above text labels, y: 170 to 235) and symbol+text (y: 170 to 260)
Write-Output "Icon 1 symbol bounds: $(GetBoundsInBox $bmp2 0 130 170 232 $bgR2 $bgG2 $bgB2)"
Write-Output "Icon 1 total bounds:  $(GetBoundsInBox $bmp2 0 130 170 266 $bgR2 $bgG2 $bgB2)"

Write-Output "Icon 2 symbol bounds: $(GetBoundsInBox $bmp2 130 260 170 232 $bgR2 $bgG2 $bgB2)"
Write-Output "Icon 2 total bounds:  $(GetBoundsInBox $bmp2 130 260 170 266 $bgR2 $bgG2 $bgB2)"

Write-Output "Icon 3 symbol bounds: $(GetBoundsInBox $bmp2 260 386 170 232 $bgR2 $bgG2 $bgB2)"
Write-Output "Icon 3 total bounds:  $(GetBoundsInBox $bmp2 260 386 170 266 $bgR2 $bgG2 $bgB2)"

$bmp2.Dispose()
