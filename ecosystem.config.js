module.exports = {
  apps: [
    {
      name: 'my-node-app-prod',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',  // Default environment (used if not specified)
      },
      env_production: {
        NODE_ENV: 'production',  // Set NODE_ENV to 'production' for production
      }
    }
  ]
};

