# Script para obtener URL de autorización de Microsoft
# Uso: .\get-microsoft-url.ps1

$baseUrl = "http://localhost:8181"
$endpoint = "$baseUrl/security/microsoft/url"

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Get
    Write-Host "URL de autorización:" $response.authorizationUrl
    Write-Host "Redirect URI:" $response.redirectUri
    # Abrir en navegador
    Start-Process $response.authorizationUrl
    Write-Host "Se abrió la URL en el navegador. Completa la autenticación y copia el código de la URL de callback."
} catch {
    Write-Host "Error obteniendo URL:" $_.Exception.Message
}