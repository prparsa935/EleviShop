param([string]$InPath, [string]$OutPath)
$ErrorActionPreference = "Stop"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($InPath, $false, $true)  # readonly, no add-to-recent
  $doc.ExportAsFixedFormat($OutPath, 17)  # wdExportFormatPDF
  $doc.Close(0)
  Write-Output "PDF exported: $OutPath"
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
