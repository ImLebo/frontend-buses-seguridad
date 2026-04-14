# Script para intercambiar código de Microsoft por token
# Uso: .\exchange-microsoft-code.ps1 -Code "AUTH_CODE"

param(
    [Parameter(Mandatory=$true)]
    [string]$Code
)

$baseUrl = "http://localhost:8181"
$endpoint = "$baseUrl/security/microsoft/code"

$body = @{
    code = $Code
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json"
    Write-Host "Intercambio exitoso. Token:" $response.token
    # Guardar token en archivo
    $response.token | Out-File -FilePath "token.txt" -Encoding UTF8
    Write-Host "Token guardado en token.txt"
} catch {
    Write-Host "Error en intercambio:" $_.Exception.Message
}