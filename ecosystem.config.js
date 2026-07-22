module.exports = {
  apps : [{
    name: 'backoffice',
    script: 'node_modules/dist/bin/next',
    args: 'start',
    autorestart: true,
    watch: false,
    instances: 1,
    env_prod: {
      PORT: 3000,
      APP_ENV: 'prod'
    }
  }]
};
