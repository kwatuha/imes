# Remote Server Deployment Guide

## Deployment Details
- **Source**: `/home/dev/dev/imes` (local machine)
- **Destination**: `kunye@165.22.227.234:/projects/`
- **Deployment Method**: Docker Compose

---

## Pre-Deployment Checklist

### 1. Clean Up Local Project (Before Copying)

Run these commands to clean up unnecessary files:

```bash
cd /home/dev/dev/imes

# Remove node_modules (will be rebuilt on server)
rm -rf api/node_modules
rm -rf frontend/node_modules
rm -rf public-dashboard/node_modules

# Remove development builds
rm -rf frontend/dist
rm -rf public-dashboard/dist

# Remove Docker volumes data (optional, keeps DB fresh)
# WARNING: This will delete your local database data
# docker-compose down -v

# Remove log files
find . -name "*.log" -type f -delete

# Remove temporary files
find . -name ".DS_Store" -type f -delete
find . -name "*.tmp" -type f -delete
```

### 2. Update Configuration Files

#### a. Update API Database Configuration
Edit `api/config/db.js` to use environment variables (should already be done):
```javascript
// Ensure it reads from environment variables
host: process.env.DB_HOST || 'localhost',
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || 'your_password',
database: process.env.DB_NAME || 'imbesdb',
```

#### b. Create/Update `.env` files

**For API** (`api/.env`):
```env
DB_HOST=db
DB_USER=impesUser
DB_PASSWORD=Admin2010impes
DB_NAME=imbesdb
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Frontend** (if needed):
```env
VITE_API_URL=http://165.22.227.234:3000/api
```

#### c. Update docker-compose.yml for production

Check that `docker-compose.yml` has proper restart policies and configurations.

### 3. Verify Required Files

Ensure these critical files exist:
- [ ] `docker-compose.yml`
- [ ] `api/Dockerfile`
- [ ] `frontend/Dockerfile`
- [ ] `public-dashboard/Dockerfile`
- [ ] `nginx/nginx.conf`
- [ ] Database schema files (`schema.sql`, `init.sql`, etc.)

### 4. Test Locally First (Recommended)

```bash
# Stop current containers
docker-compose down

# Rebuild and test
docker-compose build
docker-compose up -d

# Check if everything works
docker-compose ps
docker logs node_api --tail 50
```

---

## Deployment Steps

### Step 1: Prepare Remote Server

SSH into the remote server and prepare the environment:

```bash
# SSH into remote server
ssh kunye@165.22.227.234

# Install Docker and Docker Compose if not installed
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (to run docker without sudo)
sudo usermod -aG docker kunye
# You'll need to logout and login again for this to take effect

# Create projects directory if it doesn't exist
mkdir -p /projects
sudo chown kunye:kunye /projects

# Exit SSH for now
exit
```

### Step 2: Copy Project to Remote Server

From your local machine:

```bash
# Option A: Using rsync (Recommended - faster, resumes on failure)
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'frontend/dist' \
  --exclude 'public-dashboard/dist' \
  --exclude '.git' \
  --exclude '*.log' \
  /home/dev/dev/imes/ \
  kunye@165.22.227.234:/projects/imes/

# Option B: Using scp (simpler but slower)
scp -r /home/dev/dev/imes kunye@165.22.227.234:/projects/

# Option C: Using tar and transfer (fastest for large projects)
cd /home/dev/dev
tar czf imes.tar.gz \
  --exclude='imes/node_modules' \
  --exclude='imes/frontend/dist' \
  --exclude='imes/public-dashboard/dist' \
  --exclude='imes/.git' \
  imes/
scp imes.tar.gz kunye@165.22.227.234:/projects/
ssh kunye@165.22.227.234 "cd /projects && tar xzf imes.tar.gz && rm imes.tar.gz"
```

### Step 3: Deploy on Remote Server

SSH back into the remote server and deploy:

```bash
# SSH into remote server
ssh kunye@165.22.227.234

# Navigate to project directory
cd /projects/imes

# Create necessary directories
mkdir -p api/uploads
mkdir -p api/uploads/contractor-photos
mkdir -p api/uploads/project-photos
mkdir -p api/uploads/payment-requests
mkdir -p api/uploads/chat-files

# Set proper permissions
chmod -R 755 api/uploads

# Pull latest Docker images (if using external images)
# docker-compose pull

# Build Docker images
docker-compose build --no-cache

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs to ensure everything started correctly
docker-compose logs -f
```

### Step 4: Verify Deployment

```bash
# Check if containers are running
docker ps

# Check API health
curl http://localhost:3000/

# Check database connection
docker exec db mysql -u impesUser -pAdmin2010impes -e "SHOW DATABASES;"

# View logs for any errors
docker logs node_api --tail 100
docker logs react_frontend --tail 50
docker logs db --tail 50

# Test API endpoint
curl http://localhost:3000/api/auth/login
```

### Step 5: Configure Firewall (if needed)

```bash
# Allow necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Step 6: Access Application

From your browser, navigate to:
- **Main Application**: `http://165.22.227.234:5173`
- **Public Dashboard**: `http://165.22.227.234:5174`
- **API**: `http://165.22.227.234:3000`

---

## Post-Deployment Tasks

### 1. Setup Database

If this is a fresh deployment:

```bash
# SSH into remote server
ssh kunye@165.22.227.234
cd /projects/imes

# Import database schema
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/schema.sql

# Import initial data (if any)
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/init.sql

# Create initial admin user
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb <<EOF
INSERT INTO kemri_users (username, password, email, roleName, firstName, lastName, isActive)
VALUES ('admin', '\$2b\$10\$YourHashedPasswordHere', 'admin@example.com', 'admin', 'Admin', 'User', 1);
EOF
```

### 2. Setup SSL (Recommended for Production)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com
```

### 3. Setup Backup Script

Create a backup script:

```bash
# Create backup directory
mkdir -p /projects/imes/backups

# Create backup script
nano /projects/imes/backup.sh
```

Add this content:
```bash
#!/bin/bash
BACKUP_DIR="/projects/imes/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb > "$BACKUP_DIR/db_backup_$DATE.sql"
# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

Make it executable:
```bash
chmod +x /projects/imes/backup.sh

# Add to crontab (daily backup at 2 AM)
crontab -e
# Add: 0 2 * * * /projects/imes/backup.sh
```

### 4. Setup Monitoring

```bash
# Monitor logs
docker-compose logs -f

# Check resource usage
docker stats

# Setup automatic restart on failure (already configured with restart: unless-stopped)
```

---

## Troubleshooting

### API Not Starting

```bash
# Check logs
docker logs node_api --tail 100

# Common issue: Missing dependencies
docker exec node_api npm install

# Restart container
docker-compose restart api
```

### Database Connection Issues

```bash
# Check if database is running
docker ps | grep db

# Check database logs
docker logs db --tail 50

# Test connection
docker exec db mysql -u impesUser -pAdmin2010impes -e "SELECT 1;"
```

### Frontend Not Loading

```bash
# Check frontend logs
docker logs react_frontend --tail 50

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

---

## Maintenance Commands

### Update Application

```bash
cd /projects/imes

# Pull latest code (if using git)
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker logs node_api -f
```

### Restart Services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart api
```

### Stop/Start Services

```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d

# Stop specific service
docker-compose stop api

# Start specific service
docker-compose start api
```

### Backup Database

```bash
# Manual backup
docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Restore from backup
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < backup_20241011.sql
```

---

## Security Recommendations

1. **Change Default Passwords**: Update database passwords in docker-compose.yml
2. **Setup Firewall**: Use UFW to restrict access
3. **Enable SSL**: Use Let's Encrypt for HTTPS
4. **Regular Updates**: Keep Docker and system packages updated
5. **Monitor Logs**: Regularly check application logs for issues
6. **Backup Regularly**: Setup automated database backups
7. **Restrict SSH**: Use SSH keys instead of passwords
8. **Update JWT Secret**: Change the JWT secret in production

---

## Quick Reference

### Useful Commands

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Restart service
docker-compose restart api

# Shell into container
docker exec -it node_api bash

# Database shell
docker exec -it db mysql -u impesUser -pAdmin2010impes imbesdb

# Stop everything
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

---

## Need Help?

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify containers are running: `docker ps`
3. Check firewall settings: `sudo ufw status`
4. Verify ports are not blocked: `netstat -tulpn`


