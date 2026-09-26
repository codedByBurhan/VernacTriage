Add-Type -AssemblyName System.Drawing

$img1Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405311403.png"
$img2Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405343267.png"

$brandDir = "C:\Users\Burhanuddin\OneDrive\Desktop\VernacTriage\public\brand"
$iconsDir = "C:\Users\Burhanuddin\OneDrive\Desktop\VernacTriage\public\icons"

if (-not (Test-Path $brandDir)) { New-Item -ItemType Directory -Path $brandDir -Force }
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir -Force }

# Helper to crop a rectangle and make background transparent based on bg color
function CropWithTransparency($srcBmp, $rect, $bgR, $bgG, $bgB, $threshold, $softness, $outputPath) {
    $outBmp = New-Object System.Drawing.Bitmap $rect.Width, $rect.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $rect.Height; $y++) {
        for ($x = 0; $x -lt $rect.Width; $x++) {
            $srcX = $rect.X + $x
            $srcY = $rect.Y + $y
            if ($srcX -ge 0 -and $srcX -lt $srcBmp.Width -and $srcY -ge 0 -and $srcY -lt $srcBmp.Height) {
                $c = $srcBmp.GetPixel($srcX, $srcY)
                $dist = [Math]::Sqrt([Math]::Pow($c.R - $bgR, 2) + [Math]::Pow($c.G - $bgG, 2) + [Math]::Pow($c.B - $bgB, 2))
                
                if ($dist -lt $threshold) {
                    # fully transparent
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                } elseif ($dist -lt ($threshold + $softness)) {
                    # smooth alpha transition
                    $alpha = [int](255 * ($dist - $threshold) / $softness)
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                } else {
                    $outBmp.SetPixel($x, $y, $c)
                }
            }
        }
    }
    
    $outBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Output "Saved: $outputPath ($($rect.Width)x$($rect.Height))"
}

# 1. Primary VernacTriage Logo (from img1)
# Bounding box of logo: X=32, Y=14, Width=202, Height=106
$bmp1 = [System.Drawing.Bitmap]::FromFile($img1Path)
$logoRect = New-Object System.Drawing.Rectangle 30, 12, 206, 110
CropWithTransparency $bmp1 $logoRect 25 22 38 18 12 "$brandDir\vernactriage-logo.png"

# 2. V Monogram / App Icon (from img1)
# Bounding box of monogram: X=286, Y=12, Width=118, Height=118
# For the monogram, the rounded square has its own dark fill, so we only key out the outer background (threshold=12, softness=8)
$markRect = New-Object System.Drawing.Rectangle 285, 11, 120, 120
CropWithTransparency $bmp1 $markRect 25 22 38 10 6 "$brandDir\vernactriage-mark.png"

$bmp1.Dispose()

# 3. Multilingual Transformation Visual (from img2)
# Bounds: X=84, Y=12, Width=234, Height=134
$bmp2 = [System.Drawing.Bitmap]::FromFile($img2Path)
$transRect = New-Object System.Drawing.Rectangle 82, 10, 238, 138
CropWithTransparency $bmp2 $transRect 18 17 30 14 10 "$brandDir\vernactriage-transformation.png"

# 4. Homograph Collision icon (from img2)
# Bounds: X=56, Y=178, Width=34, Height=58
$icon1Rect = New-Object System.Drawing.Rectangle 55, 176, 36, 60
CropWithTransparency $bmp2 $icon1Rect 18 17 30 14 10 "$iconsDir\icon-homograph-collision.png"

# 5. Deterministic Audit icon (from img2)
# Bounds: X=162, Y=178, Width=76, Height=58
$icon2Rect = New-Object System.Drawing.Rectangle 160, 176, 80, 60
CropWithTransparency $bmp2 $icon2Rect 18 17 30 14 10 "$iconsDir\icon-deterministic-audit.png"

# 6. Phonetic Ear-Spelling icon (from img2)
# Bounds: X=300, Y=178, Width=58, Height=58
$icon3Rect = New-Object System.Drawing.Rectangle 298, 176, 62, 60
CropWithTransparency $bmp2 $icon3Rect 18 17 30 14 10 "$iconsDir\icon-phonetic-ear-spelling.png"

$bmp2.Dispose()

Write-Output "Asset extraction completed successfully."
