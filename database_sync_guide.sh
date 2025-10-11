#!/bin/bash

# Database Sync Guide
# This script helps you sync databases between local and remote

REMOTE_USER="kunye"
REMOTE_HOST="165.22.227.234"
REMOTE_PATH="/projects/imes"
SSH_KEY="~/.ssh/id_asusme"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================"
echo "Database Sync Options"
echo "========================================"
echo ""
echo "Current Status:"
echo "  Local:  32 projects"
echo "  Remote: 72 projects"
echo ""
echo "Choose an option:"
echo ""
echo "1) Export LOCAL database and import to REMOTE"
echo "   (Remote will have 32 projects - replaces all data)"
echo ""
echo "2) Export REMOTE database and import to LOCAL"
echo "   (Local will have 72 projects - for verification)"
echo ""
echo "3) Just view sample data from both databases"
echo ""
echo "4) Export both databases for backup"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Option 1: Export LOCAL → Import to REMOTE${NC}"
        echo "This will REPLACE all data on the remote server!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "Step 1: Exporting local database..."
            docker exec db mysqldump -u impesUser -pAdmin2010impes \
                --single-transaction --quick --lock-tables=false \
                imbesdb > local_db_dump_$(date +%Y%m%d_%H%M%S).sql
            
            DUMP_FILE=$(ls -t local_db_dump_*.sql | head -1)
            echo -e "${GREEN}✓ Exported to: $DUMP_FILE${NC}"
            
            echo ""
            echo "Step 2: Transferring to remote server..."
            scp -i $SSH_KEY $DUMP_FILE $REMOTE_USER@$REMOTE_HOST:/tmp/
            echo -e "${GREEN}✓ Transferred${NC}"
            
            echo ""
            echo "Step 3: Backing up remote database..."
            ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST \
                "docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb > /tmp/remote_backup_$(date +%Y%m%d_%H%M%S).sql"
            echo -e "${GREEN}✓ Remote database backed up${NC}"
            
            echo ""
            echo "Step 4: Importing to remote database..."
            ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST \
                "docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < /tmp/$DUMP_FILE"
            echo -e "${GREEN}✓ Imported to remote database${NC}"
            
            echo ""
            echo -e "${GREEN}Done! Remote database now has your local data.${NC}"
        else
            echo "Cancelled."
        fi
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}Option 2: Export REMOTE → Import to LOCAL${NC}"
        echo "This will REPLACE all data on your local database!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "Step 1: Backing up local database..."
            docker exec db mysqldump -u impesUser -pAdmin2010impes \
                imbesdb > local_backup_$(date +%Y%m%d_%H%M%S).sql
            echo -e "${GREEN}✓ Local database backed up${NC}"
            
            echo ""
            echo "Step 2: Exporting remote database..."
            ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST \
                "docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb" \
                > remote_db_dump_$(date +%Y%m%d_%H%M%S).sql
            
            DUMP_FILE=$(ls -t remote_db_dump_*.sql | head -1)
            echo -e "${GREEN}✓ Exported from remote: $DUMP_FILE${NC}"
            
            echo ""
            echo "Step 3: Importing to local database..."
            docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < $DUMP_FILE
            echo -e "${GREEN}✓ Imported to local database${NC}"
            
            echo ""
            echo -e "${GREEN}Done! Local database now has remote data.${NC}"
            echo "Access at: http://localhost:5173"
        else
            echo "Cancelled."
        fi
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}=== LOCAL DATABASE SAMPLE ===${NC}"
        docker exec db mysql -u impesUser -pAdmin2010impes imbesdb \
            -e "SELECT id, projectName, status, departmentId FROM kemri_projects WHERE voided = 0 LIMIT 10;"
        
        echo ""
        echo -e "${BLUE}=== REMOTE DATABASE SAMPLE ===${NC}"
        ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST \
            "docker exec db mysql -u impesUser -pAdmin2010impes imbesdb \
            -e 'SELECT id, projectName, status, departmentId FROM kemri_projects WHERE voided = 0 LIMIT 10;'"
        ;;
        
    4)
        echo ""
        echo "Exporting both databases for backup..."
        
        echo "Exporting local database..."
        docker exec db mysqldump -u impesUser -pAdmin2010impes \
            imbesdb > backups/local_db_$(date +%Y%m%d_%H%M%S).sql
        
        echo "Exporting remote database..."
        ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST \
            "docker exec db mysqldump -u impesUser -pAdmin2010impes imbesdb" \
            > backups/remote_db_$(date +%Y%m%d_%H%M%S).sql
        
        echo -e "${GREEN}✓ Both databases backed up to ./backups/${NC}"
        ls -lh backups/*.sql | tail -2
        ;;
        
    *)
        echo "Invalid choice"
        ;;
esac

