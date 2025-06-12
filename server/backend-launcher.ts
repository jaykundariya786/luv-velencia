import { spawn } from 'child_process';
import path from 'path';

export function startLVBackend() {
  const backendPath = path.join(process.cwd(), 'LV Backend');
  
  // Start the LV Backend server
  const backend = spawn('node', ['start.js'], {
    cwd: backendPath,
    stdio: 'pipe',
    env: {
      ...process.env,
      PORT: '5001',
      NODE_ENV: 'development'
    }
  });

  backend.stdout?.on('data', (data) => {
    console.log(`[LV Backend] ${data.toString().trim()}`);
  });

  backend.stderr?.on('data', (data) => {
    console.error(`[LV Backend Error] ${data.toString().trim()}`);
  });

  backend.on('error', (err) => {
    console.error('Failed to start LV Backend:', err);
  });

  backend.on('exit', (code) => {
    console.log(`LV Backend exited with code ${code}`);
  });

  return backend;
}