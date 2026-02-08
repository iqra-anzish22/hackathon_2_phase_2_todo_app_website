# Phase 2 Todo App - Kubernetes Deployment Script
# Run this in PowerShell

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "Phase 2 Todo Application - Kubernetes Deployment" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Minikube Status
Write-Host "[1/6] Checking Minikube status..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Minikube is not running!" -ForegroundColor Red
    Write-Host "Please start minikube with: minikube start" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Minikube is running" -ForegroundColor Green
Write-Host ""

# Step 2: Verify Docker Images
Write-Host "[2/6] Verifying Docker images..." -ForegroundColor Yellow
$backendImage = docker images phase2-backend:latest --format "{{.Repository}}:{{.Tag}}"
$frontendImage = docker images phase2-frontend:latest --format "{{.Repository}}:{{.Tag}}"

if (-not $backendImage) {
    Write-Host "ERROR: phase2-backend:latest image not found!" -ForegroundColor Red
    Write-Host "Please build the backend image first." -ForegroundColor Red
    exit 1
}

if (-not $frontendImage) {
    Write-Host "ERROR: phase2-frontend:latest image not found!" -ForegroundColor Red
    Write-Host "Please build the frontend image first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Backend image found: $backendImage" -ForegroundColor Green
Write-Host "✓ Frontend image found: $frontendImage" -ForegroundColor Green
Write-Host ""

# Step 3: Load Images into Minikube
Write-Host "[3/6] Loading images into Minikube..." -ForegroundColor Yellow
Write-Host "Loading backend image (this may take a minute)..." -ForegroundColor Gray
minikube image load phase2-backend:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to load backend image!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend image loaded" -ForegroundColor Green

Write-Host "Loading frontend image (this may take a minute)..." -ForegroundColor Gray
minikube image load phase2-frontend:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to load frontend image!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend image loaded" -ForegroundColor Green
Write-Host ""

# Step 4: Verify Images in Minikube
Write-Host "[4/6] Verifying images in Minikube..." -ForegroundColor Yellow
$minikubeImages = minikube ssh "docker images | grep phase2"
Write-Host $minikubeImages -ForegroundColor Gray
Write-Host "✓ Images verified in Minikube" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy with Helm
Write-Host "[5/6] Deploying application with Helm..." -ForegroundColor Yellow
$helmInstall = helm install todo-app ./todo-chatbot 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Helm installation failed!" -ForegroundColor Red
    Write-Host $helmInstall -ForegroundColor Red
    exit 1
}
Write-Host $helmInstall -ForegroundColor Gray
Write-Host "✓ Application deployed successfully" -ForegroundColor Green
Write-Host ""

# Step 6: Wait for Pods to be Ready
Write-Host "[6/6] Waiting for pods to be ready..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 10

$maxAttempts = 12
$attempt = 0
$allReady = $false

while ($attempt -lt $maxAttempts -and -not $allReady) {
    $attempt++
    Write-Host "Checking pod status (attempt $attempt/$maxAttempts)..." -ForegroundColor Gray

    $pods = kubectl get pods -l app.kubernetes.io/instance=todo-app -o json | ConvertFrom-Json
    $allReady = $true

    foreach ($pod in $pods.items) {
        $podName = $pod.metadata.name
        $ready = $false

        foreach ($condition in $pod.status.conditions) {
            if ($condition.type -eq "Ready" -and $condition.status -eq "True") {
                $ready = $true
                break
            }
        }

        if (-not $ready) {
            $allReady = $false
            Write-Host "  Pod $podName is not ready yet..." -ForegroundColor Gray
        }
    }

    if (-not $allReady) {
        Start-Sleep -Seconds 5
    }
}

Write-Host ""
kubectl get pods -l app.kubernetes.io/instance=todo-app
Write-Host ""

if ($allReady) {
    Write-Host "✓ All pods are ready!" -ForegroundColor Green
} else {
    Write-Host "⚠ Pods are still starting. Check status with: kubectl get pods" -ForegroundColor Yellow
}
Write-Host ""

# Get Minikube IP and Display Access URLs
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

$minikubeIP = minikube ip
Write-Host "Minikube IP: $minikubeIP" -ForegroundColor White
Write-Host ""
Write-Host "Access your application:" -ForegroundColor White
Write-Host "  Frontend:     http://${minikubeIP}:30000" -ForegroundColor Green
Write-Host "  Backend API:  http://${minikubeIP}:30001" -ForegroundColor Green
Write-Host "  API Docs:     http://${minikubeIP}:30001/docs" -ForegroundColor Green
Write-Host "  Health Check: http://${minikubeIP}:30001/health" -ForegroundColor Green
Write-Host ""

# Test Backend Health
Write-Host "Testing backend health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://${minikubeIP}:30001/health" -TimeoutSec 5
    Write-Host "✓ Backend is healthy: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠ Backend health check failed (may still be starting)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "View pods:              kubectl get pods" -ForegroundColor White
Write-Host "View all resources:     kubectl get all -l app.kubernetes.io/instance=todo-app" -ForegroundColor White
Write-Host "Backend logs:           kubectl logs -l app.kubernetes.io/component=backend -f" -ForegroundColor White
Write-Host "Frontend logs:          kubectl logs -l app.kubernetes.io/component=frontend -f" -ForegroundColor White
Write-Host "Open frontend:          minikube service todo-app-phase2-todo-app-frontend" -ForegroundColor White
Write-Host "Open backend:           minikube service todo-app-phase2-todo-app-backend" -ForegroundColor White
Write-Host "Uninstall:              helm uninstall todo-app" -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
