# Nginx Proxy Setup Complete ✅

## Summary
Successfully configured Nginx to proxy the public dashboard through a unified port (80). Now all services can be accessed through a single entry point.

---

## Port Access Guide

### Development (Current Local Setup)

#### Direct Access (Development Ports)
| Service | Direct URL | Notes |
|---------|-----------|-------|
| Main Frontend | http://localhost:5173 | Vite dev server (HMR enabled) |
| Public Dashboard | http://localhost:5174 | Vite dev server (HMR enabled) |
| Backend API | http://localhost:3000/api | Node.js/Express API |

#### Proxied Access (Production-like through Nginx)
| Service | Proxied URL | Notes |
|---------|------------|-------|
| Main Frontend | http://localhost:8080/impes/ | Through Nginx proxy |
| Public Dashboard | http://localhost:8080/public/ | Through Nginx proxy ✅ NEW! |
| Backend API | http://localhost:8080/api/ | Through Nginx proxy |
| Uploads | http://localhost:8080/uploads/ | Through Nginx proxy |

### Production (Remote Server - After Deployment)

All services accessible through single port (80 or 443):

| Service | Production URL | Public Access |
|---------|---------------|---------------|
| Main Frontend | http://165.22.227.234/impes/ | Internal staff only |
| Public Dashboard | http://165.22.227.234/public/ | Public citizens ✅ |
| Backend API | http://165.22.227.234/api/ | API endpoints |
| Uploads | http://165.22.227.234/uploads/ | Project files/photos |

---

## What Was Changed

### 1. Updated nginx/nginx.conf ✅

Added public dashboard routing:

```nginx
# Handle Public Dashboard
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

# Handle Vite HMR for public dashboard
location /public/@vite/ {
    proxy_pass http://public-dashboard:5173/@vite/;
    # ... proxy headers ...
}
```

### 2. Updated public-dashboard/src/App.jsx ✅

Added support for base path routing:

```javascript
function App() {
  // Use /public as basename when accessed through nginx proxy
  // Empty string for direct access on port 5174
  const basename = import.meta.env.VITE_BASE_PATH || '';
  
  return (
    <Router basename={basename}>
      {/* ... */}
    </Router>
  );
}
```

### 3. Restarted Nginx ✅

```bash
docker compose restart nginx_proxy
```

---

## Benefits

### 🔒 Security
- ✅ Only need to open port 80/443 on firewall
- ✅ Internal services hidden from direct access
- ✅ Can add SSL/TLS easily
- ✅ Can add rate limiting, authentication at proxy level

### 🎯 Simplicity
- ✅ Single domain/IP for all services
- ✅ No need to remember multiple ports
- ✅ Easier to manage DNS and certificates
- ✅ Standard production setup

### 🚀 Flexibility
- ✅ Can add more services easily
- ✅ Can move services to different servers (proxy handles routing)
- ✅ Can add load balancing later
- ✅ Can add CDN/caching at proxy level

---

## Testing the Setup

### Test Locally

1. **Test Direct Access (Port 5174)**
   ```bash
   curl http://localhost:5174/
   # Or open in browser: http://localhost:5174
   ```

2. **Test Proxied Access (Port 8080)**
   ```bash
   curl http://localhost:8080/public/
   # Or open in browser: http://localhost:8080/public/
   ```

3. **Test All Services Through Nginx**
   ```bash
   # Main frontend
   curl -I http://localhost:8080/impes/
   
   # Public dashboard
   curl -I http://localhost:8080/public/
   
   # API
   curl http://localhost:8080/api/public/financial-years
   
   # Uploads
   curl -I http://localhost:8080/uploads/
   ```

### Expected Results

All endpoints should return:
- ✅ HTTP 200 OK status
- ✅ Content-Type: text/html (for pages)
- ✅ Content-Type: application/json (for API)
- ✅ No CORS errors
- ✅ No network errors

---

## Remote Deployment Configuration

### Firewall Rules (Remote Server)

Only need to open these ports:

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for SSL later)
sudo ufw allow 443/tcp

# Allow SSH
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### Port Mapping in Production

Update `docker-compose.yml` for production:

```yaml
services:
  nginx_proxy:
    ports:
      - "80:80"      # HTTP (public)
      - "443:443"    # HTTPS (public)
    
  frontend:
    ports: []        # No direct external access
    
  public-dashboard:
    ports: []        # No direct external access
    
  api:
    ports: []        # No direct external access
    
  mysql_db:
    ports: []        # No direct external access
```

### Environment Variables for Production

For public-dashboard, set in `docker-compose.yml`:

```yaml
public-dashboard:
  environment:
    VITE_BASE_PATH: /public
    VITE_API_URL: http://165.22.227.234/api
```

---

## URL Structure

### Development URLs

```
http://localhost:8080/                  → Redirects to /impes/
http://localhost:8080/impes/            → Main Frontend (Internal Staff)
http://localhost:8080/public/           → Public Dashboard (Citizens)
http://localhost:8080/api/              → Backend API
http://localhost:8080/uploads/          → File Uploads
```

### Production URLs

```
http://165.22.227.234/                  → Redirects to /impes/
http://165.22.227.234/impes/            → Main Frontend (Internal Staff)
http://165.22.227.234/public/           → Public Dashboard (Citizens)
http://165.22.227.234/api/              → Backend API
http://165.22.227.234/uploads/          → File Uploads
```

### With Domain Name (Future)

```
http://yourdomain.com/                  → Redirects to /impes/
http://yourdomain.com/impes/            → Main Frontend (Internal Staff)
http://yourdomain.com/public/           → Public Dashboard (Citizens)
http://yourdomain.com/api/              → Backend API
http://yourdomain.com/uploads/          → File Uploads
```

---

## Comparison: Before vs After

### ❌ Before (Multiple Ports)

```
Access Methods:
- Frontend: http://165.22.227.234:5173 ⚠️ Needs firewall rule
- Public:   http://165.22.227.234:5174 ⚠️ Needs firewall rule  
- API:      http://165.22.227.234:3000 ⚠️ Needs firewall rule

Problems:
- Multiple firewall rules needed
- Users need to remember different ports
- Can't easily add SSL
- Not production standard
- Security risk (dev servers exposed)
```

### ✅ After (Single Port through Nginx)

```
Access Methods:
- Frontend: http://165.22.227.234/impes/  ✓ Through port 80
- Public:   http://165.22.227.234/public/ ✓ Through port 80
- API:      http://165.22.227.234/api/    ✓ Through port 80

Benefits:
- Single firewall rule (port 80)
- Standard production setup
- Easy to add SSL (Let's Encrypt)
- Can add authentication/rate limiting
- Professional and secure
```

---

## Adding SSL/HTTPS (Future)

When you're ready to add HTTPS:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com

# Certbot will automatically:
# 1. Get SSL certificate from Let's Encrypt
# 2. Update nginx configuration
# 3. Setup auto-renewal
```

Then access via:
```
https://yourdomain.com/impes/   → Main Frontend
https://yourdomain.com/public/  → Public Dashboard
https://yourdomain.com/api/     → Backend API
```

---

## Troubleshooting

### Public Dashboard Not Loading Through Proxy

**Check nginx is running:**
```bash
docker ps | grep nginx_proxy
```

**Check nginx configuration:**
```bash
docker exec nginx_proxy nginx -t
```

**View nginx logs:**
```bash
docker logs nginx_proxy --tail 50
```

**Restart nginx:**
```bash
docker compose restart nginx_proxy
```

### Direct Port Access Not Working

**Check if port is exposed:**
```bash
docker ps | grep public_dashboard
# Should show: 0.0.0.0:5174->5173/tcp
```

**Check if service is running:**
```bash
docker logs public_dashboard --tail 50
```

### CORS Errors

If you see CORS errors, ensure API is configured properly:

```javascript
// api/app.js should have:
const corsOptions = {
  origin: '*', // For development
  // or specific origins for production:
  // origin: ['http://yourdomain.com', 'http://165.22.227.234']
};
app.use(cors(corsOptions));
```

---

## Quick Reference

### View All Access Points
```bash
# Through nginx proxy (production-like)
echo "Main Frontend:    http://localhost:8080/impes/"
echo "Public Dashboard: http://localhost:8080/public/"
echo "API:              http://localhost:8080/api/"
echo ""
echo "Direct access (development):"
echo "Main Frontend:    http://localhost:5173"
echo "Public Dashboard: http://localhost:5174"
echo "API:              http://localhost:3000"
```

### Test All Endpoints
```bash
# Create test script
cat > test_endpoints.sh << 'EOF'
#!/bin/bash
echo "Testing Nginx Proxy Access..."
echo ""
echo "1. Main Frontend:"
curl -s -I http://localhost:8080/impes/ | grep "HTTP"
echo ""
echo "2. Public Dashboard:"
curl -s -I http://localhost:8080/public/ | grep "HTTP"
echo ""
echo "3. API Financial Years:"
curl -s http://localhost:8080/api/public/financial-years | head -c 100
echo ""
echo "4. API Health:"
curl -s http://localhost:8080/api/ | head -c 50
echo ""
echo "All tests complete!"
EOF

chmod +x test_endpoints.sh
./test_endpoints.sh
```

---

## Status

✅ **Configuration Complete!**

| Component | Status | Access |
|-----------|--------|--------|
| Nginx Config | ✅ Updated | - |
| Public Dashboard App | ✅ Updated | http://localhost:8080/public/ |
| Nginx Service | ✅ Restarted | - |
| Direct Access | ✅ Working | http://localhost:5174 |
| Proxied Access | ✅ Working | http://localhost:8080/public/ |
| Ready for Deployment | ✅ Yes | - |

---

## Deployment Checklist

Before deploying to remote server:

- [x] Nginx configuration updated
- [x] Public dashboard supports base path
- [x] Nginx restarted and tested locally
- [x] Direct access works (port 5174)
- [x] Proxied access works (port 8080/public/)
- [ ] Test in production environment
- [ ] Update firewall rules (only port 80/443)
- [ ] Setup SSL certificate (optional)
- [ ] Update DNS records (if using domain)

---

**Next Step:** Deploy to remote server using the deployment script!

```bash
./pre_deployment_check.sh
./deploy_to_remote.sh
```


