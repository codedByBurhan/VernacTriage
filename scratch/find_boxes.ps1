Add-Type -AssemblyName System.Drawing

$img1Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405311403.png"
$bmp1 = [System.Drawing.Bitmap]::FromFile($img1Path)
$bgR1 = 25; $bgG1 = 22; $bgB1 = 38

# Function to check if pixel is different from bg
function IsForeground($c, $bgR, $bgG, $bgB, $threshold) {
    $diff = [Math]::Abs($c.R - $bgR) + [Math]::Abs($c.G - $bgG) + [Math]::Abs($c.B - $bgB)
    return $diff -gt $threshold
}

# Image 1 column projection
$cols1 = @()
for ($x = 0; $x -lt $bmp1.Width; $x++) {
    $fgCount = 0
    for ($y = 0; $y -lt $bmp1.Height; $y++) {
        if (IsForeground ($bmp1.GetPixel($x, $y)) $bgR1 $bgG1 $bgB1 30) {
            $fgCount++
        }
    }
    $cols1 += $fgCount
}

# Find gap between logo and monogram
$gapStart = 0; $gapEnd = 0
for ($x = 100; $x -lt $bmp1.Width - 50; $x++) {
    if ($cols1[$x] -eq 0 -and $cols1[$x-1] -gt 0) { $gapStart = $x }
    if ($cols1[$x] -gt 0 -and $cols1[$x-1] -eq 0) { $gapEnd = $x }
}
Write-Output "Image 1 logo/monogram split around x=$gapStart to x=$gapEnd"

# Bounds of left asset (Logo)
$minX = 999; $maxX = 0; $minY = 999; $maxY = 0
for ($x = 0; $x -lt $gapEnd; $x++) {
    for ($y = 0; $y -lt $bmp1.Height; $y++) {
        if (IsForeground ($bmp1.GetPixel($x, $y)) $bgR1 $bgG1 $bgB1 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Output "Logo bounds: X=[$minX, $maxX], Y=[$minY, $maxY], Size: $($maxX-$minX+1)x$($maxY-$minY+1)"

# Bounds of right asset (V monogram)
$minX2 = 999; $maxX2 = 0; $minY2 = 999; $maxY2 = 0
for ($x = $gapEnd; $x -lt $bmp1.Width; $x++) {
    for ($y = 0; $y -lt $bmp1.Height; $y++) {
        # Check against background or corner of the icon
        if (IsForeground ($bmp1.GetPixel($x, $y)) $bgR1 $bgG1 $bgB1 15) {
            if ($x -lt $minX2) { $minX2 = $x }
            if ($x -gt $maxX2) { $maxX2 = $x }
            if ($y -lt $minY2) { $minY2 = $y }
            if ($y -gt $maxY2) { $maxY2 = $y }
        }
    }
}
Write-Output "Monogram bounds: X=[$minX2, $maxX2], Y=[$minY2, $maxY2], Size: $($maxX2-$minX2+1)x$($maxY2-$minY2+1)"

$bmp1.Dispose()

# Now inspect Image 2
$img2Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405343267.png"
$bmp2 = [System.Drawing.Bitmap]::FromFile($img2Path)
$bgR2 = 18; $bgG2 = 17; $bgB2 = 30

# Image 2 row projection
Write-Output "--- Image 2 Row Analysis ---"
$rows2 = @()
for ($y = 0; $y -lt $bmp2.Height; $y++) {
    $fgCount = 0
    for ($x = 0; $x -lt $bmp2.Width; $x++) {
        if (IsForeground ($bmp2.GetPixel($x, $y)) $bgR2 $bgG2 $bgB2 30) {
            $fgCount++
        }
    }
    $rows2 += $fgCount
}

# Find vertical gap between transformation graphic (top) and icons (bottom)
for ($y = 100; $y -lt $bmp2.Height - 30; $y++) {
    if ($rows2[$y] -eq 0 -and $rows2[$y-1] -gt 0) { Write-Output "Row gap start at y=$y" }
    if ($rows2[$y] -gt 0 -and $rows2[$y-1] -eq 0) { Write-Output "Row gap end at y=$y" }
}

$bmp2.Dispose()
