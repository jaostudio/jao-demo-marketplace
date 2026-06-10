param(
  [string]$OutputDir = "..\public\products"
)

Add-Type -AssemblyName System.Drawing

$images = @(
  @{File="heritage-kamiseta.jpg"; R=139; G=69; B=19},    # saddle brown
  @{File="banig-mat.jpg";       R=210; G=180; B=140},    # tan
  @{File="pinukpok-abaca.jpg";  R=160; G=82; B=45},     # sienna
  @{File="pineapple-scarf.jpg"; R=245; G=222; B=179},   # wheat
  @{File="abaca-tote.jpg";      R=222; G=184; B=135},   # burlywood
  @{File="ceramic-vase.jpg";    R=139; G=0; B=0},       # dark red
  @{File="itneg-wine-glass.jpg";R=188; G=143; B=143},   # rosy brown
  @{File="garden-turtle.jpg";   R=85; G=107; B=47},     # dark olive green
  @{File="rattan-mirror.jpg";   R=255; G=215; B=0},     # gold
  @{File="bamboo-basket.jpg";   R=34; G=139; B=34},     # forest green
  @{File="wood-platter.jpg";    R=139; G=69; B=19},     # saddle brown
  @{File="mahogany-frame.jpg";  R=128; G=0; B=0},       # maroon
  @{File="mural-canvas.jpg";    R=255; G=99; B=71},     # tomato
  @{File="cordillera-print.jpg";R=46; G=139; B=87},     # sea green
  @{File="katipunan-flag.jpg";  R=220; G=20; B=60},     # crimson
  @{File="benguet-arabica.jpg"; R=107; G=66; B=38},     # coffee brown
  @{File="davao-honey.jpg";     R=218; G=165; B=32},    # goldenrod
  @{File="cacao-tea.jpg";       R=62; G=39; B=35},      # dark brown
  @{File="shell-necklace.jpg";  R=255; G=105; B=180},   # hot pink
  @{File="puka-anklet.jpg";     R=240; G=230; B=140},   # khaki
  @{File="capiz-coaster.jpg";   R=224; G=255; B=255},   # light cyan
  @{File="shell-wind-chime.jpg";R=255; G=228; B=181},   # moccasin
  @{File="capiz-candle-holder.jpg";R=255;G=250; B=205}, # lemon chiffon
  @{File="mangosteen-vinegar.jpg";R=153;G=50; B=204},   # dark orchid
  @{File="coconut-sugar.jpg";   R=245; G=245; B=220},   # beige
  @{File="dried-mangoes.jpg";   R=255; G=165; B=0}      # orange
)

$resolvedDir = Resolve-Path $OutputDir

foreach ($img in $images) {
  $filePath = Join-Path $resolvedDir $img.File
  if (Test-Path $filePath) {
    Write-Host "  SKIP $($img.File) (exists)"
    continue
  }
  $bmp = New-Object System.Drawing.Bitmap(200, 200)
  $color = [System.Drawing.Color]::FromArgb(255, $img.R, $img.G, $img.B)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear($color)
  $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "  OK   $($img.File)"
}

Write-Host "`nDone! Generated $($images.Count) images in $resolvedDir"
