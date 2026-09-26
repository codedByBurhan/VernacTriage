Add-Type -AssemblyName System.Drawing

$img1Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405311403.png"
$img2Path = "C:\Users\Burhanuddin\.gemini\antigravity-ide\brain\82fcb743-bd4b-446a-94a6-3a8c75f2c857\.user_uploaded\media_1790405343267.png"

$bmp1 = [System.Drawing.Bitmap]::FromFile($img1Path)
Write-Output "Image 1: $($bmp1.Width) x $($bmp1.Height)"
$c1 = $bmp1.GetPixel(0, 0)
Write-Output "Image 1 BG: R=$($c1.R), G=$($c1.G), B=$($c1.B), A=$($c1.A)"

$bmp2 = [System.Drawing.Bitmap]::FromFile($img2Path)
Write-Output "Image 2: $($bmp2.Width) x $($bmp2.Height)"
$c2 = $bmp2.GetPixel(0, 0)
Write-Output "Image 2 BG: R=$($c2.R), G=$($c2.G), B=$($c2.B), A=$($c2.A)"

$bmp1.Dispose()
$bmp2.Dispose()
