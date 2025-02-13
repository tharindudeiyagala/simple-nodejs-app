FROM ubuntu:latest

# Install necessary packages
RUN apt update && apt install -y \
    curl \
    nodejs \
    npm \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Install pm2 globally
RUN npm install -g pm2

# Copy the rest of the application files
COPY . .

# Copy Nginx configuration from the project directory
COPY nginx.conf /etc/nginx/sites-available/nodejs

# Enable Nginx configuration
RUN ln -s /etc/nginx/sites-available/nodejs /etc/nginx/sites-enabled/
RUN rm -rf /etc/nginx/sites-enabled/default

# Expose the port your app runs on
EXPOSE 80

# Start the application and Nginx
CMD pm2 start ecosystem.config.js --env production && nginx -g 'daemon off;'
