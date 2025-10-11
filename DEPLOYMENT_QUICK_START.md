# Quick Deployment Guide to Remote Server

## TL;DR - Quick Deployment

```bash
# 1. Run pre-deployment check
chmod +x pre_deployment_check.sh
./pre_deployment_check.sh

# 2. If all checks pass, deploy
chmod +x deploy_to_remote.sh
./deploy_to_remote.sh

# 3. After deployment, setup database
ssh kunye@165.22.227.234
cd /projects/imes
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/schema.sql
```

## Access Your Application

After deployment, access at:
- **Frontend**: http://165.22.227.234:5173
- **Public Dashboard**: http://165.22.227.234:5174
- **API**: http://165.22.227.234:3000

---

## Before You Deploy

### 1. Things to Clean Up (Optional)

```bash
cd /home/dev/dev/imes

# Remove node_modules (saves transfer time)
rm -rf api/node_modules frontend/node_modules public-dashboard/node_modules

# Remove build artifacts
rm -rf frontend/dist public-dashboard/dist
```

### 2. Important Configuration

Make sure these are set correctly:

**File: `docker-compose.yml`**
- Database credentials match between `api` and `mysql_db` services
- Ports are correct (3000 for API, 5173 for frontend)

**File: `api/config/db.js`**
- Uses environment variables: `process.env.DB_HOST`, etc.

---

## Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Check if everything is ready
./pre_deployment_check.sh

# Deploy automatically
./deploy_to_remote.sh
```

The script will:
1. ✓ Check SSH connectivity
2. ✓ Clean up local files
3. ✓ Create deployment package
4. ✓ Backup existing deployment
5. ✓ Transfer files
6. ✓ Build Docker images
7. ✓ Start containers

### Method 2: Manual rsync

```bash
# Sync files to remote server
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'frontend/dist' \
  --exclude '.git' \
  /home/dev/dev/imes/ \
  kunye@165.22.227.234:/projects/imes/

# SSH and deploy
ssh kunye@165.22.227.234
cd /projects/imes
docker-compose build
docker-compose up -d
```

### Method 3: Manual tar transfer

```bash
# Create archive
cd /home/dev/dev
tar czf imes.tar.gz \
  --exclude='imes/node_modules' \
  --exclude='imes/.git' \
  imes/

# Transfer
scp imes.tar.gz kunye@165.22.227.234:/projects/

# SSH and extract
ssh kunye@165.22.227.234
cd /projects
tar xzf imes.tar.gz
cd imes
docker-compose build
docker-compose up -d
```

---

## Post-Deployment Setup

### 1. Import Database Schema

```bash
ssh kunye@165.22.227.234
cd /projects/imes

# Import schema
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/schema.sql

# Import initial data (if you have it)
docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/init.sql
```

### 2. Create Admin User

```bash
# SSH into remote server
ssh kunye@165.22.227.234

# Access database
docker exec -it db mysql -u impesUser -pAdmin2010impes imbesdb

# Run SQL to create admin user
# (You'll need to hash the password first using bcrypt)
```

### 3. Verify Everything Works

```bash
# Check container status
docker ps

# View logs
docker-compose logs -f

# Test API
curl http://localhost:3000/

# Test database
docker exec db mysql -u impesUser -pAdmin2010impes -e "SHOW DATABASES;"
```

---

## Common Issues & Solutions

### Issue: "Cannot connect to remote server"
```bash
# Test SSH connection
ssh kunye@165.22.227.234

# If using password, add your SSH key:
ssh-copy-id kunye@165.22.227.234
```

### Issue: "Port already in use"
```bash
# On remote server, find what's using the port
sudo lsof -i :3000

# Either kill the process or change the port in docker-compose.yml
```

### Issue: "Database connection failed"
```bash
# Check database logs
docker logs db

# Verify credentials in docker-compose.yml match
# Restart database
docker-compose restart mysql_db
```

### Issue: "API not responding"
```bash
# Check API logs
docker logs node_api

# Common fix: Install dependencies
docker exec node_api npm install
docker-compose restart api
```

### Issue: "Frontend shows blank page"
```bash
# Check if API URL is correct
# Check browser console for errors
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

---

## Useful Commands

### On Local Machine

```bash
# Check deployment readiness
./pre_deployment_check.sh

# Deploy to remote
./deploy_to_remote.sh

# Manual sync
rsync -avz /home/dev/dev/imes/ kunye@165.22.227.234:/projects/imes/
```

### On Remote Server

```bash
# SSH into server
ssh kunye@165.22.227.234

# Navigate to project
cd /projects/imes

# View all logs
docker-compose logs -f

# View specific service log
docker logs node_api -f

# Check status
docker-compose ps

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Stop everything
docker-compose down

# Remove everything including volumes (DANGER!)
docker-compose down -v
```

---

## Monitoring & Maintenance

### View Logs
```bash
ssh kunye@165.22.227.234 "cd /projects/imes && docker-compose logs -f"
```

### Backup Database
```bash
ssh kunye@165.22.227.234 "docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb" > backup_$(date +%Y%m%d).sql
```

### Update Application
```bash
# Deploy new version
./deploy_to_remote.sh

# Or manually
ssh kunye@165.22.227.234
cd /projects/imes
docker-compose down
docker-compose build
docker-compose up -d
```

---

## Security Checklist

- [ ] Change default database passwords
- [ ] Setup firewall (UFW)
- [ ] Enable SSL/HTTPS
- [ ] Setup automated backups
- [ ] Use SSH keys (not passwords)
- [ ] Change JWT secret in production
- [ ] Keep Docker and system updated
- [ ] Monitor logs regularly

---

## Need More Details?

See comprehensive guides:
- **Full deployment guide**: `REMOTE_DEPLOYMENT_GUIDE.md`
- **General deployment**: `DEPLOYMENT_GUIDE.md`
- **Docker configuration**: `docker-compose.yml`

---

## Quick Reference Card

| Action | Command |
|--------|---------|
| Deploy | `./deploy_to_remote.sh` |
| Check readiness | `./pre_deployment_check.sh` |
| SSH to server | `ssh kunye@165.22.227.234` |
| View logs | `docker-compose logs -f` |
| Restart service | `docker-compose restart api` |
| Stop all | `docker-compose down` |
| Rebuild all | `docker-compose build` |
| Database backup | `docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb > backup.sql` |
| Database restore | `docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < backup.sql` |

---

**Server**: 165.22.227.234  
**User**: kunye  
**Path**: /projects/imes  
**Ports**: 3000 (API), 5173 (Frontend), 5174 (Public), 3306 (DB)

