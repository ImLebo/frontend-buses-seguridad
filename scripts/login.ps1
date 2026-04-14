# Script para login local
# Uso: .\login.ps1 -Email "admin@demo.com" -Password "123456"

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,

    [Parameter(Mandatory=$true)]
    [string]$Password
)

$baseUrl = "http://localhost:8181"
$endpoint = "$baseUrl/security/login"

$body = @{
    email = $Email
    password = $Password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json"
    Write-Host "Login exitoso. Token:" $response.token
    # Guardar token en archivo
    $response.token | Out-File -FilePath "token.txt" -Encoding UTF8
    Write-Host "Token guardado en token.txt"
} catch {
    Write-Host "Error en login:" $_.Exception.Message
}