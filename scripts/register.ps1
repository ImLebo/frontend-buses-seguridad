# Script para registrar un usuario local
# Uso: .\register.ps1 -Name "Usuario Demo" -Email "user@demo.com" -Password "123456"

param(
    [Parameter(Mandatory=$true)]
    [string]$Name,

    [Parameter(Mandatory=$true)]
    [string]$Email,

    [Parameter(Mandatory=$true)]
    [string]$Password
)

$baseUrl = "http://localhost:8181"
$endpoint = "$baseUrl/security/register"

$body = @{
    name = $Name
    email = $Email
    password = $Password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json"
    Write-Host "Registro exitoso. Token:" $response.token
    # Guardar token en archivo
    $response.token | Out-File -FilePath "token.txt" -Encoding UTF8
    Write-Host "Token guardado en token.txt"
} catch {
    Write-Host "Error en registro:" $_.Exception.Message
}