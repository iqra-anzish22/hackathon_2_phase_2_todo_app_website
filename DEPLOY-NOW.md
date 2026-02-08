# DEPLOYMENT INSTRUCTIONS

## 🚀 Deploy Your Application Now

### **Step 1: Open PowerShell**

1. Press `Win + X` and select **"Windows PowerShell"** or **"Terminal"**
2. Navigate to the project directory:
   ```powershell
   cd C:\Users\anzis\Desktop\phase2_hack2
   ```

### **Step 2: Run the Deployment Script**

Execute the PowerShell deployment script:

```powershell
.\deploy.ps1
```

**OR** if you get execution policy error, run:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\deploy.ps1
```

---

## 📋 Manual Deployment (Alternative)

If you prefer to run commands manually, follow these steps:

### **1. Load Images into Minikube**

```powershell
# Load backend image
minikube image load phase2-backend:latest

# Load frontend image
minikube image load phase2-frontend:latest

# Verify images
minikube ssh "docker images | grep phase2"
```

### **2. Deploy with Helm**

```powershell
# Install the Helm chart
helm install todo-app ./todo-chatbot

# Watch deployment
kubectl get pods -w
```

Press `Ctrl+C` to stop watching once pods show `1/1 Running`

### **3. Get Access URLs**

```powershell
# Get Minikube IP
$MINIKUBE_IP = minikube ip

# Display URLs
Write-Host "Frontend: http://$MINIKUBE_IP:30000"
Write-Host "Backend API: http://$MINIKUBE_IP:30001"
Write-Host "API Docs: http://$MINIKUBE_IP:30001/docs"
```

### **4. Open in Browser**

```powershell
# Open frontend
minikube service todo-app-phase2-todo-app-frontend

# Open backend API docs
minikube service todo-app-phase2-todo-app-backend
```

---

## ✅ Verify Deployment

```powershell
# Check pods status
kubectl get pods

# Check all resources
kubectl get all -l app.kubernetes.io/instance=todo-app

# View backend logs
kubectl logs -l app.kubernetes.io/component=backend

# View frontend logs
kubectl logs -l app.kubernetes.io/component=frontend

# Test backend health
$MINIKUBE_IP = minikube ip
curl "http://$MINIKUBE_IP:30001/health"
```

---

## 🐛 Troubleshooting

### Issue: "Execution Policy" Error

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the script again.

### Issue: Pods Not Starting

**Check logs:**
```powershell
kubectl describe pod -l app.kubernetes.io/instance=todo-app
kubectl logs -l app.kubernetes.io/component=backend --tail=50
kubectl logs -l app.kubernetes.io/component=frontend --tail=50
```

### Issue: Images Not Found

**Reload images:**
```powershell
minikube image load phase2-backend:latest
minikube image load phase2-frontend:latest
kubectl delete pod -l app.kubernetes.io/instance=todo-app
```

---

## 🗑️ Cleanup (If Needed)

```powershell
# Uninstall the application
helm uninstall todo-app

# Verify cleanup
kubectl get all -l app.kubernetes.io/instance=todo-app
```

---

## 📞 Next Steps

1. **Run the deployment script:** `.\deploy.ps1`
2. **Wait for pods to be ready** (30-60 seconds)
3. **Access the frontend** at the URL shown
4. **Test the application** by creating tasks

---

**Status:** ✅ Ready to Deploy
**Action Required:** Run `.\deploy.ps1` in PowerShell
