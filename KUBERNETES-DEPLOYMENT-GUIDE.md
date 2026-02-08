# Kubernetes Deployment Guide - Phase 2 Todo Application

## 📋 Prerequisites

- ✅ Minikube installed and running
- ✅ kubectl configured
- ✅ Helm 3.x installed
- ✅ Docker images built:
  - `phase2-backend:latest`
  - `phase2-frontend:latest`

## 🚀 Quick Start Deployment

### Step 1: Verify Minikube is Running

```bash
minikube status
```

If not running, start it:
```bash
minikube start
```

### Step 2: Load Docker Images into Minikube

Since the images are built locally, you need to load them into minikube's Docker environment:

```bash
# Load backend image
minikube image load phase2-backend:latest

# Load frontend image
minikube image load phase2-frontend:latest

# Verify images are loaded
minikube ssh docker images | grep phase2
```

**Expected Output:**
```
phase2-backend    latest    <image-id>    700MB
phase2-frontend   latest    <image-id>    301MB
```

### Step 3: Deploy with Helm

Navigate to the project directory and install the Helm chart:

```bash
cd C:\Users\anzis\Desktop\phase2_hack2

# Install the chart
helm install todo-app ./todo-chatbot

# Or with custom release name
helm install my-todo-app ./todo-chatbot
```

### Step 4: Verify Deployment

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/instance=todo-app

# Check pods status
kubectl get pods

# Check services
kubectl get svc
```

**Expected Output:**
```
NAME                                        READY   STATUS    RESTARTS   AGE
pod/todo-app-phase2-todo-app-backend-xxx   1/1     Running   0          30s
pod/todo-app-phase2-todo-app-frontend-xxx  1/1     Running   0          30s

NAME                                    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/todo-app-phase2-todo-app-backend    NodePort   10.96.xxx.xxx   <none>        8001:30001/TCP   30s
service/todo-app-phase2-todo-app-frontend   NodePort   10.96.xxx.xxx   <none>        3000:30000/TCP   30s
```

### Step 5: Access the Application

Get the Minikube IP:
```bash
minikube ip
```

Access the services:
```bash
# Get Minikube IP
export MINIKUBE_IP=$(minikube ip)

# Backend API
echo "Backend API: http://$MINIKUBE_IP:30001"
echo "API Docs: http://$MINIKUBE_IP:30001/docs"
echo "Health Check: http://$MINIKUBE_IP:30001/health"

# Frontend
echo "Frontend: http://$MINIKUBE_IP:30000"
```

Or use minikube service commands:
```bash
# Open backend in browser
minikube service todo-app-phase2-todo-app-backend

# Open frontend in browser
minikube service todo-app-phase2-todo-app-frontend

# Get URLs only
minikube service todo-app-phase2-todo-app-backend --url
minikube service todo-app-phase2-todo-app-frontend --url
```

---

## 🔧 Configuration

### Customizing Values

Create a custom values file `my-values.yaml`:

```yaml
backend:
  replicaCount: 2
  env:
    DEBUG: "true"
    DATABASE_URL: "your-custom-database-url"

frontend:
  replicaCount: 2
  env:
    NEXT_PUBLIC_API_URL: "http://your-backend-url"

auth:
  secret: "your-custom-secret-key-min-32-chars"
```

Deploy with custom values:
```bash
helm install todo-app ./todo-chatbot -f my-values.yaml
```

### Environment Variables

The following environment variables are configured:

**Backend:**
- `BETTER_AUTH_SECRET`: JWT secret (from Secret)
- `DEBUG`: Debug mode (false)
- `ENVIRONMENT`: Environment (production)
- `CORS_ORIGINS`: Allowed CORS origins
- `DATABASE_URL`: PostgreSQL connection string

**Frontend:**
- `BETTER_AUTH_SECRET`: JWT secret (from Secret)
- `NODE_ENV`: Node environment (production)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `BETTER_AUTH_URL`: Frontend URL
- `DATABASE_URL`: SQLite database path

---

## 📊 Monitoring & Debugging

### View Logs

```bash
# Backend logs
kubectl logs -l app.kubernetes.io/component=backend --tail=50 -f

# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend --tail=50 -f

# Specific pod logs
kubectl logs <pod-name> -f
```

### Check Pod Status

```bash
# Watch pods
kubectl get pods -w

# Describe pod for detailed info
kubectl describe pod <pod-name>

# Get pod events
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Check Services

```bash
# List services
kubectl get svc

# Describe service
kubectl describe svc todo-app-phase2-todo-app-backend
kubectl describe svc todo-app-phase2-todo-app-frontend

# Check endpoints
kubectl get endpoints
```

### Check ConfigMaps and Secrets

```bash
# List ConfigMaps
kubectl get configmap

# View ConfigMap
kubectl describe configmap todo-app-phase2-todo-app-backend-config

# List Secrets
kubectl get secrets

# View Secret (base64 encoded)
kubectl get secret todo-app-phase2-todo-app-auth -o yaml
```

---

## 🔄 Updating the Deployment

### Update Image

If you rebuild the Docker images:

```bash
# Rebuild images
docker build -t phase2-backend:latest ./backend
docker build -t phase2-frontend:latest ./frontend

# Load new images into minikube
minikube image load phase2-backend:latest
minikube image load phase2-frontend:latest

# Restart pods to use new images
kubectl rollout restart deployment/todo-app-phase2-todo-app-backend
kubectl rollout restart deployment/todo-app-phase2-todo-app-frontend

# Watch rollout status
kubectl rollout status deployment/todo-app-phase2-todo-app-backend
kubectl rollout status deployment/todo-app-phase2-todo-app-frontend
```

### Upgrade Helm Release

```bash
# Upgrade with new values
helm upgrade todo-app ./todo-chatbot

# Upgrade with custom values file
helm upgrade todo-app ./todo-chatbot -f my-values.yaml

# Check upgrade history
helm history todo-app
```

### Rollback

```bash
# Rollback to previous version
helm rollback todo-app

# Rollback to specific revision
helm rollback todo-app 1
```

---

## 🗑️ Cleanup

### Uninstall Helm Release

```bash
# Uninstall the release
helm uninstall todo-app

# Verify resources are deleted
kubectl get all -l app.kubernetes.io/instance=todo-app
```

### Remove Images from Minikube

```bash
# SSH into minikube
minikube ssh

# Remove images
docker rmi phase2-backend:latest
docker rmi phase2-frontend:latest

# Exit
exit
```

### Stop Minikube

```bash
minikube stop
```

---

## 🐛 Troubleshooting

### Pods Not Starting

**Issue:** Pods stuck in `ImagePullBackOff` or `ErrImagePull`

**Solution:**
```bash
# Verify images are loaded
minikube ssh docker images | grep phase2

# If missing, load them
minikube image load phase2-backend:latest
minikube image load phase2-frontend:latest

# Delete and recreate pods
kubectl delete pod -l app.kubernetes.io/instance=todo-app
```

### Pods Crashing (CrashLoopBackOff)

**Issue:** Pods keep restarting

**Solution:**
```bash
# Check logs for errors
kubectl logs -l app.kubernetes.io/component=backend --tail=100

# Check pod events
kubectl describe pod <pod-name>

# Common issues:
# 1. Database connection error - check DATABASE_URL
# 2. Missing environment variables - check ConfigMap
# 3. Port conflicts - check service configuration
```

### Cannot Access Services

**Issue:** Services not accessible via NodePort

**Solution:**
```bash
# Verify minikube is running
minikube status

# Get minikube IP
minikube ip

# Check service is exposed
kubectl get svc

# Use minikube service command
minikube service todo-app-phase2-todo-app-frontend --url

# Check if pods are ready
kubectl get pods
```

### Database Connection Errors

**Issue:** Backend cannot connect to database

**Solution:**
```bash
# Check backend logs
kubectl logs -l app.kubernetes.io/component=backend --tail=50

# Verify DATABASE_URL in ConfigMap
kubectl get configmap todo-app-phase2-todo-app-backend-config -o yaml

# Update DATABASE_URL if needed
helm upgrade todo-app ./todo-chatbot --set backend.env.DATABASE_URL="your-new-url"
```

### Frontend Cannot Connect to Backend

**Issue:** Frontend shows API connection errors

**Solution:**
```bash
# Check frontend logs
kubectl logs -l app.kubernetes.io/component=frontend --tail=50

# Verify NEXT_PUBLIC_API_URL
kubectl get configmap todo-app-phase2-todo-app-frontend-config -o yaml

# Get actual backend URL
minikube service todo-app-phase2-todo-app-backend --url

# Update frontend config
helm upgrade todo-app ./todo-chatbot --set frontend.env.NEXT_PUBLIC_API_URL="http://$(minikube ip):30001"
```

---

## 📝 Useful Commands Reference

### Helm Commands

```bash
# List releases
helm list

# Get release status
helm status todo-app

# Get release values
helm get values todo-app

# Get release manifest
helm get manifest todo-app

# Test chart
helm lint ./todo-chatbot

# Dry run
helm install todo-app ./todo-chatbot --dry-run --debug
```

### Kubectl Commands

```bash
# Get all resources
kubectl get all

# Get resources by label
kubectl get all -l app.kubernetes.io/instance=todo-app

# Port forward
kubectl port-forward svc/todo-app-phase2-todo-app-backend 8001:8001
kubectl port-forward svc/todo-app-phase2-todo-app-frontend 3000:3000

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/sh

# Copy files from pod
kubectl cp <pod-name>:/path/to/file ./local-file

# Get resource YAML
kubectl get deployment todo-app-phase2-todo-app-backend -o yaml
```

### Minikube Commands

```bash
# Start minikube
minikube start

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete

# Get minikube IP
minikube ip

# SSH into minikube
minikube ssh

# Open dashboard
minikube dashboard

# List addons
minikube addons list

# Enable addon
minikube addons enable ingress
```

---

## 🎯 Production Considerations

For production deployment, consider:

1. **Change the AUTH_SECRET**: Generate a secure random secret
   ```bash
   openssl rand -base64 32
   ```

2. **Use PostgreSQL**: Configure proper database connection
   ```yaml
   backend:
     env:
       DATABASE_URL: "postgresql+asyncpg://user:pass@host:5432/db"
   ```

3. **Enable Ingress**: For proper domain-based routing
   ```yaml
   ingress:
     enabled: true
     hosts:
       - host: todo-app.example.com
   ```

4. **Configure Resources**: Set appropriate CPU/memory limits
   ```yaml
   backend:
     resources:
       limits:
         cpu: 1000m
         memory: 1Gi
   ```

5. **Enable Autoscaling**: For handling load
   ```yaml
   autoscaling:
     enabled: true
     minReplicas: 2
     maxReplicas: 10
   ```

6. **Add Persistent Storage**: For SQLite databases
   ```yaml
   persistence:
     enabled: true
     size: 5Gi
   ```

---

## ✅ Verification Checklist

- [ ] Minikube is running
- [ ] Docker images are built
- [ ] Images are loaded into minikube
- [ ] Helm chart is installed
- [ ] Pods are running (1/1 Ready)
- [ ] Services are created
- [ ] Backend health check returns 200
- [ ] Frontend is accessible
- [ ] Backend API docs are accessible
- [ ] Frontend can communicate with backend

---

**Deployment Date:** 2026-02-08
**Chart Version:** 1.0.0
**Status:** ✅ Ready for Local Deployment
