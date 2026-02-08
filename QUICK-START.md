# Quick Start - Deploy Now!

## 🚀 Ready to Deploy

Your Helm chart is ready! Follow these steps to deploy:

### Step 1: Load Images into Minikube

Open **PowerShell** or **Command Prompt** and run:

```powershell
# Load backend image
minikube image load phase2-backend:latest

# Load frontend image
minikube image load phase2-frontend:latest

# Verify images are loaded
minikube ssh "docker images | grep phase2"
```

### Step 2: Deploy with Helm

```powershell
# Navigate to project directory
cd C:\Users\anzis\Desktop\phase2_hack2

# Install the Helm chart
helm install todo-app ./todo-chatbot

# Watch the deployment
kubectl get pods -w
```

**Expected Output:**
```
NAME: todo-app
LAST DEPLOYED: 2026-02-08
NAMESPACE: default
STATUS: deployed
REVISION: 1
```

### Step 3: Wait for Pods to be Ready

Wait until both pods show `1/1 Running`:

```powershell
kubectl get pods
```

**Expected:**
```
NAME                                              READY   STATUS    RESTARTS   AGE
todo-app-phase2-todo-app-backend-xxx              1/1     Running   0          30s
todo-app-phase2-todo-app-frontend-xxx             1/1     Running   0          30s
```

### Step 4: Access Your Application

```powershell
# Get Minikube IP
$MINIKUBE_IP = minikube ip

# Display URLs
Write-Host "Frontend: http://$MINIKUBE_IP:30000"
Write-Host "Backend API: http://$MINIKUBE_IP:30001"
Write-Host "API Docs: http://$MINIKUBE_IP:30001/docs"
Write-Host "Health Check: http://$MINIKUBE_IP:30001/health"
```

**Or use minikube service commands:**

```powershell
# Open frontend in browser
minikube service todo-app-phase2-todo-app-frontend

# Open backend in browser
minikube service todo-app-phase2-todo-app-backend
```

---

## 🎯 One-Command Deployment

**Use the automated script:**

```cmd
deploy-to-kubernetes.bat
```

This will handle everything automatically!

---

## ✅ Verify Deployment

```powershell
# Check all resources
kubectl get all -l app.kubernetes.io/instance=todo-app

# Check backend health
$MINIKUBE_IP = minikube ip
curl "http://$MINIKUBE_IP:30001/health"

# Check frontend
curl -I "http://$MINIKUBE_IP:30000"
```

---

## 📊 View Logs

```powershell
# Backend logs
kubectl logs -l app.kubernetes.io/component=backend -f

# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend -f
```

---

## 🗑️ Cleanup (if needed)

```powershell
# Uninstall
helm uninstall todo-app

# Verify cleanup
kubectl get all -l app.kubernetes.io/instance=todo-app
```

---

## 🎉 You're Ready!

Everything is configured and ready to deploy. Just run the commands above!

**Recommended:** Use `deploy-to-kubernetes.bat` for automated deployment.
