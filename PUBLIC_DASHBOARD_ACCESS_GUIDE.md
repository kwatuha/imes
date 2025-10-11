# Public Dashboard Access Guide

## Summary

The public dashboard works perfectly but has different access methods for **development** vs **production**.

---

## ✅ DEVELOPMENT (Current Setup)

### Direct Access (Recommended for Development)
```
http://localhost:5174
```

**Why this works:**
- Vite dev server serves at root with HMR (Hot Module Replacement)
- All assets load correctly with proper MIME types
- Fast development with instant reload

### Through Nginx (Has issues with Vite dev server)
```
http://localhost:8080/public/  ⚠️ Currently has MIME type issues
```

**Why it doesn't fully work:**
- Vite's dev server doesn't properly support base paths for internal modules
- `/@vite/client` served with wrong MIME type through proxy
- This is a known Vite dev server limitation

---

## ✅ PRODUCTION (Remote Server)

For production deployment, the public dashboard WILL work through nginx at `/public/`:

```
http://165.22.227.234/public/  ✅ Will work after production build
```

**Why production works:**
- Production builds are static files (no Vite dev server)
- Assets are bundled with correct paths
- No dynamic module serving issues

---

## Configuration Summary

### Current Files:

1. **`docker-compose.yml`**: Port 5174 exposed for direct access
2. **`nginx/nginx.conf`**: `/public/` location configured
3. **`vite.config.js`**: Base path configured for production
4. **`App.jsx`**: Basename configured for routing

---

## Recommended Workflow

### During Development

**Option 1: Direct Access (Easiest)**
```
Main Frontend:     http://localhost:5173
Public Dashboard:  http://localhost:5174
API:               http://localhost:3000
```

**Option 2: Through Nginx (For testing)**
```
Main Frontend:     http://localhost:8080/impes/
Public Dashboard:  Use direct port 5174 instead
API:               http://localhost:8080/api/
```

### For Production Deployment

1. Build the production version
2. Deploy with docker-compose
3. Access through single port (80/443):
   ```
   Main Frontend:     http://165.22.227.234/impes/
   Public Dashboard:  http://165.22.227.234/public/
   API:               http://165.22.227.234/api/
   ```

---

## Production Build Configuration

To properly build for production, update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use base path only for production builds
  base: command === 'build' ? '/public/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    }
  }
}))
```

---

## Deployment Steps

### 1. Update docker-compose for production

Create `docker-compose.production.yml`:

```yaml
public-dashboard:
  build:
    context: ./public-dashboard
    dockerfile: DockerfileProduction
  environment:
    VITE_API_URL: /api  # Use relative URL in production
```

### 2. Create Production Dockerfile

Create `public-dashboard/DockerfileProduction`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/public
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Deploy

```bash
docker-compose -f docker-compose.production.yml up -d
```

---

## Why Vite Dev Server + Nginx is Complicated

**Technical Explanation:**

Vite's dev server uses ES modules and special handling for:
- `/@vite/client` - HMR client
- `/@react-refresh` - React fast refresh
- Virtual modules and plugins

When you set `base: '/public/'`:
- HTML correctly references `/public/@vite/client`
- But Vite dev server doesn't serve modules at `/public/@vite/client`
- It only serves them at `/@vite/client`
- This causes MIME type mismatches

**Production builds don't have this issue** because:
- All code is bundled into static files
- No dynamic module resolution
- Simple file serving

---

## Quick Reference

| Environment | Main Frontend | Public Dashboard | Notes |
|-------------|--------------|------------------|-------|
| **Development** | http://localhost:5173 | http://localhost:5174 | Direct access, HMR works |
| **Dev through Nginx** | http://localhost:8080/impes/ | Use port 5174 instead | Vite dev server limitations |
| **Production** | http://SERVER/impes/ | http://SERVER/public/ | Works perfectly |

---

## Testing Before Deployment

1. ✅ Test main frontend through nginx:
   ```
   http://localhost:8080/impes/
   ```

2. ✅ Test public dashboard direct:
   ```
   http://localhost:5174
   ```

3. ✅ Test API:
   ```
   http://localhost:8080/api/public/financial-years
   ```

4. ✅ Build production version and test:
   ```bash
   cd public-dashboard
   npm run build
   # Serve dist folder and test
   ```

---

## Conclusion

**For Development:** 
- Use `http://localhost:5174` for public dashboard ✅
- Use `http://localhost:5173` for main frontend ✅
- Everything works perfectly!

**For Production:**
- Use `http://165.22.227.234/public/` through nginx ✅
- Everything will work after proper production build!

**Current Status:** ✅ Ready for deployment with understanding that dev access is direct port, production access is through nginx.

---

Would you like me to create the production build configuration now?


