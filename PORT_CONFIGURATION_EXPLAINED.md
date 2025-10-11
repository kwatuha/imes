# Port Configuration Guide

## Current Port Structure (Development)

### Port Overview

| Port | Service | Access Method | URL Example |
|------|---------|---------------|-------------|
| **5173** | Main Frontend (Vite Dev) | Direct | http://localhost:5173 |
| **5174** | Public Dashboard (Vite Dev) | Direct | http://localhost:5174 |
| **8080** | Nginx Proxy | Proxied | http://localhost:8080/impes/ |
| **3000** | Backend API | Direct | http://localhost:3000/api |
| **3307** | MySQL Database | Direct | mysql://localhost:3307 |

---

## What's the Difference?

### **Port 5173 vs Port 8080** (Main Frontend)

#### Port 5173 (Direct Access)
- **What**: Direct connection to the Vite development server
- **Use**: Development and debugging
- **Features**: 
  - ✓ Hot Module Replacement (HMR)
  - ✓ Fast refresh
  - ✓ Direct React app access
- **URL**: `http://localhost:5173`
- **Routing**: React Router handles all routes at root level

#### Port 8080 (Nginx Proxy)
- **What**: Access through Nginx reverse proxy
- **Use**: Production-like environment testing
- **Features**:
  - ✓ URL rewriting (adds `/impes` prefix)
  - ✓ Proxies API calls
  - ✓ Handles WebSocket connections
  - ✓ Serves uploads
- **URL**: `http://localhost:8080/impes/`
- **Routing**: Nginx proxies to React app, adds `/impes` base path

### **Port 5174** (Public Dashboard)
- **What**: Direct connection to Public Dashboard Vite dev server
- **Use**: Public-facing dashboard for citizens
- **Features**:
  - ✓ Separate React application
  - ✓ Public API access (no authentication)
  - ✓ Independent deployment
- **URL**: `http://localhost:5174`
- **Current Issue**: ⚠️ **NOT included in Nginx proxy configuration!**

---

## Problem for Remote Deployment

### Current Nginx Configuration Issues:

1. ❌ **Public Dashboard NOT proxied** - Port 5174 won't be accessible through port 80
2. ❌ **No unified access** - Users need to remember multiple ports
3. ❌ **Firewall complexity** - Need to open multiple ports

### What This Means for Remote Server:

**Current Setup (Without Fix):**
- ✅ Main Frontend: `http://165.22.227.234:5173` (if port opened)
- ✅ Public Dashboard: `http://165.22.227.234:5174` (if port opened)
- ✅ API: `http://165.22.227.234:3000` (if port opened)

**Problems:**
- Multiple ports to open in firewall
- Not production-standard
- Insecure (exposes dev servers directly)

**Better Setup (With Fix):**
- ✅ Main Frontend: `http://165.22.227.234/impes/`
- ✅ Public Dashboard: `http://165.22.227.234/public/`
- ✅ API: `http://165.22.227.234/api/`
- ✅ All through port 80 (or 443 for HTTPS)

---

## Recommended Solution

### Update Nginx Configuration

Add public dashboard routing to `nginx/nginx.conf`:

```nginx
# Add this section to handle public dashboard
location /public/ {
    proxy_pass http://public-dashboard:5173/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

# Handle /public without trailing slash
location = /public {
    return 301 /public/;
}
```

### Update Public Dashboard Base Path

Modify `public-dashboard/src/main.jsx` to use base path:

```javascript
import { BrowserRouter as Router } from 'react-router-dom';

<Router basename="/public">
  <App />
</Router>
```

---

## Deployment Scenarios

### Scenario 1: Development (Current)
```
Frontend:         http://localhost:5173
Public Dashboard: http://localhost:5174
API:              http://localhost:3000
Nginx Proxy:      http://localhost:8080/impes/
```

### Scenario 2: Production with Nginx (Recommended)
```
All services through port 80:
Frontend:         http://yourdomain.com/impes/
Public Dashboard: http://yourdomain.com/public/
API:              http://yourdomain.com/api/
```

### Scenario 3: Direct Port Access (Not Recommended)
```
Frontend:         http://yourdomain.com:5173
Public Dashboard: http://yourdomain.com:5174
API:              http://yourdomain.com:3000
```
**Problems**: Multiple firewall rules, security risks, non-standard

---

## Production Deployment Best Practices

### Port Configuration for Remote Server

**External Ports (Open to Internet):**
- **80** - HTTP traffic (Nginx)
- **443** - HTTPS traffic (Nginx with SSL)
- **22** - SSH (for management)

**Internal Ports (Docker Network Only):**
- **5173** - Frontend container
- **5174** - Public Dashboard container
- **3000** - API container
- **3306** - MySQL container

**Port Mapping in docker-compose.yml:**
```yaml
nginx_proxy:
  ports:
    - "80:80"    # Only open port 80 externally
    
frontend:
  ports: []      # No external ports needed
  
public-dashboard:
  ports: []      # No external ports needed
  
api:
  ports: []      # No external ports needed
  
mysql_db:
  ports: []      # No external ports needed
```

---

## Answer to Your Questions

### 1. What's the difference between 5173 and 8080?

**Port 5173**: Direct access to Vite dev server (development)
**Port 8080**: Access through Nginx proxy (production-like)

**Use 8080 for testing** production routing and URL structure.

### 2. Will port 5174 be accessible on remote server?

**Current Setup**: Only if you specifically open port 5174 in the firewall

**Recommended**: Use Nginx to proxy public dashboard through port 80/443 at `/public/` path

**Answer**: 
- ⚠️ **Without changes**: Port 5174 won't be accessible unless you open it in firewall
- ✅ **With Nginx update**: Access at `http://165.22.227.234/public/` through port 80

---

## Quick Fix Commands

### Update Nginx Configuration
```bash
# Edit nginx configuration
nano /home/dev/dev/imes/nginx/nginx.conf

# Restart nginx
docker-compose restart nginx_proxy
```

### Open Ports on Remote Server (Alternative)
```bash
# If you want direct port access (not recommended)
sudo ufw allow 5173/tcp
sudo ufw allow 5174/tcp
sudo ufw allow 3000/tcp
```

### Check Current Ports
```bash
# On remote server
sudo netstat -tulpn | grep LISTEN
```

---

## Recommendation

✅ **UPDATE NGINX** to proxy public dashboard through port 80
- More secure
- Easier to manage
- Standard practice
- Better for SSL/HTTPS later
- Only need to open port 80/443

❌ **DON'T** expose development ports (5173, 5174) directly in production
- Security risk
- Non-standard
- Hard to manage
- Can't use SSL easily

---

## Next Steps

1. Update nginx configuration (I can help with this)
2. Update public-dashboard to use `/public` base path
3. Restart nginx
4. Test locally: `http://localhost:8080/public/`
5. Deploy to remote server
6. Access via: `http://165.22.227.234/public/`


