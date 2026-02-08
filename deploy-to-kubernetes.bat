@echo off
REM ============================================================================
REM Phase 2 Todo App - Kubernetes Deployment Script for Windows
REM ============================================================================

echo ============================================================================
echo Phase 2 Todo Application - Kubernetes Deployment
echo ============================================================================
echo.

REM Step 1: Check Minikube Status
echo [1/6] Checking Minikube status...
minikube status
if %errorlevel% neq 0 (
    echo ERROR: Minikube is not running!
    echo Please start minikube with: minikube start
    exit /b 1
)
echo ✓ Minikube is running
echo.

REM Step 2: Verify Docker Images
echo [2/6] Verifying Docker images...
docker images | findstr phase2-backend
docker images | findstr phase2-frontend
if %errorlevel% neq 0 (
    echo ERROR: Docker images not found!
    echo Please build the images first.
    exit /b 1
)
echo ✓ Docker images found
echo.

REM Step 3: Load Images into Minikube
echo [3/6] Loading images into Minikube...
echo Loading backend image...
minikube image load phase2-backend:latest
echo Loading frontend image...
minikube image load phase2-frontend:latest
echo ✓ Images loaded into Minikube
echo.

REM Step 4: Verify Images in Minikube
echo [4/6] Verifying images in Minikube...
minikube ssh "docker images | grep phase2"
echo ✓ Images verified in Minikube
echo.

REM Step 5: Deploy with Helm
echo [5/6] Deploying application with Helm...
helm install todo-app ./todo-chatbot
if %errorlevel% neq 0 (
    echo ERROR: Helm installation failed!
    exit /b 1
)
echo ✓ Application deployed
echo.

REM Step 6: Wait for Pods to be Ready
echo [6/6] Waiting for pods to be ready...
timeout /t 10 /nobreak >nul
kubectl get pods -l app.kubernetes.io/instance=todo-app
echo.

REM Get Minikube IP
echo ============================================================================
echo Deployment Complete!
echo ============================================================================
echo.
echo Getting access URLs...
for /f "tokens=*" %%i in ('minikube ip') do set MINIKUBE_IP=%%i
echo.
echo Frontend: http://%MINIKUBE_IP%:30000
echo Backend API: http://%MINIKUBE_IP%:30001
echo API Docs: http://%MINIKUBE_IP%:30001/docs
echo Health Check: http://%MINIKUBE_IP%:30001/health
echo.
echo ============================================================================
echo Useful Commands:
echo ============================================================================
echo View pods: kubectl get pods
echo View logs (backend): kubectl logs -l app.kubernetes.io/component=backend
echo View logs (frontend): kubectl logs -l app.kubernetes.io/component=frontend
echo Open frontend: minikube service todo-app-phase2-todo-app-frontend
echo Open backend: minikube service todo-app-phase2-todo-app-backend
echo Uninstall: helm uninstall todo-app
echo ============================================================================
echo.
pause
