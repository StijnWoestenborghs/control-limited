#!/bin/bash

# Function to clean up temporary files
cleanup() {
  rm -f $SFTP_SCRIPT
}
trap cleanup EXIT

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
else
  echo ".env file not found. Exiting..."
  exit 1
fi

# Check for the --skip-blogs flag
SKIP_BLOGS=false
for arg in "$@"; do
  if [ "$arg" == "--skip-blogs" ]; then
    SKIP_BLOGS=true
  fi
done

# Build the React application
echo "Building the React application..."
npm run dbuild

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting..."
  exit 1
fi

# Ensure that the build directory exists
if [ ! -d "./dist" ]; then
  echo "Build directory ./dist not found. Exiting..."
  exit 1
fi

# Remove the blogs directory if the --skip-blogs flag is set
if [ "$SKIP_BLOGS" = true ]; then
  echo "Skipping the blogs directory..."
  rm -rf ./dist/blogs
fi

# Deploy the built files using SFTP
echo "Deploying the built files..."

# Create a temporary script for sftp commands
SFTP_SCRIPT=$(mktemp)

# Write the SFTP commands to the script
cat <<EOT >> $SFTP_SCRIPT
lcd ./dist
cd $SFTP_REMOTE_DIR
mput -r *
exit
EOT

# Run the SFTP command with the generated script
sftp -oPort=$SFTP_PORT $SFTP_USERNAME@$SFTP_HOST < $SFTP_SCRIPT

# Check if the deployment was successful
if [ $? -ne 0 ]; then
  echo "Deployment failed. Exiting..."
  exit 1
fi

echo "Deployment finished successfully!"
