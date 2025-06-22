#!/bin/bash

echo "Starting deployment script..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Git is installed
if command_exists git; then
    echo "Git is installed."
else
    echo "Error: Git is not installed. Please install Git before running this script."
    exit 1
fi

# Check if npm is installed
if command_exists npm; then
    echo "npm is installed."
else
    echo "Error: npm is not installed. Please install Node.js and npm before running this script."
    exit 1
fi

# Check if Docker is installed
if command_exists docker; then
    echo "Docker is installed."
else
    echo "Error: Docker is not installed. Please install Docker before running this script."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and rerun this script."
    exit 1
else
    echo "Docker is running."
fi

# Check if a specific task (like a Node.js process) is already running
if pgrep -x "node" > /dev/null; then
    echo "A Node.js process is already running. Please stop it before proceeding."
    exit 1
else
    echo "No existing Node.js process found."
fi

# Clone the repository
echo "Cloning the repository..."
git clone [REPO_URL]
cd [REPO_NAME]

# Fetch updates
echo "Fetching updates from remote..."
git fetch

# Switch to the assigned branch
echo "Switching to branch: ems-payroll-create..."
git checkout -b ems-payroll-create

# Install libraries and dependencies
echo "Installing libraries and dependencies..."
npm install

# Start the database
echo "Starting the database..."
npm run db:start

# Add .env file
echo "Creating .env file..."
cat <<EOT >> .env
# Mysql Database ENV
DB_HOST='localhost'
DB_PORT='3306'
DB_USER='admin'
DB_PASSWORD='1234'
DB_NAME='pcbeedb'
DB_CONNECTION_LIMIT=20

# Server ENV
SERVER_PORT=5000
EOT

# Update the database by running migrations
echo "Running database migrations..."
npm run db:migrate

# Run the application
echo "Starting the application..."
npm run start:dev

echo "Deployment script finished!"