# auto-sync.ps1: Script sinkronisasi otomatis ke GitHub
$repoPath = $PSScriptRoot
Set-Location $repoPath

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Auto-Sync GitHub Aktif untuk Repository Sqolah " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Memantau perubahan file setiap 10 detik..." -ForegroundColor Gray
Write-Host "Tekan Ctrl+C untuk menghentikan.`n" -ForegroundColor Yellow

while ($true) {
    Start-Sleep -Seconds 10
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "[$timestamp] Perubahan terdeteksi! Menyimpan ke GitHub..." -ForegroundColor Yellow
        git add .
        git commit -m "auto-sync: update $timestamp"
        git push origin main
        Write-Host "[$timestamp] Berhasil di-push ke GitHub!`n" -ForegroundColor Green
    }
}
