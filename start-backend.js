const { spawn } = require('child_process');
const path = require('path');

// Start LV Backend server
const backendPath = path.join(__dirname, 'LV Backend');
const backend = spawn('node', ['server.js'], {
  cwd: backendPath,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '5001',
    NODE_ENV: 'development'
  }
});

backend.on('error', (err) => {
  console.error('Failed to start LV Backend:', err);
});

backend.on('exit', (code) => {
  console.log(`LV Backend exited with code ${code}`);
});

console.log('LV Backend started on port 5001');