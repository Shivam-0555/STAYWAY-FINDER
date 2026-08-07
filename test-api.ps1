$ProgressPreference = 'SilentlyContinue'
try {
    $body = '{"status":"Accepted"}'
    $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/owner/visit-request/6a75677787d20e977e85e029' -Method PUT -ContentType 'application/json' -Body $body
    Write-Host "SUCCESS:"
    Write-Host ($result | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "DETAILS: $($_.ErrorDetails.Message)"
}
