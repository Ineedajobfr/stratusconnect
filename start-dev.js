#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting StratusConnect Development Server...');
console.log('📁 Working Directory:', process.cwd());
console.log('⏰ Started at:', new Date().toLocaleTimeString());
console.log('');

// Start the development server
const devProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

// Handle process events
devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
  process.exit(1);
});

devProcess.on('close', (code) => {
  console.log(`\n🛑 Development server stopped with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting in 3 seconds...');
    setTimeout(() => {
      console.log('🔄 Restarting development server...');
      // Restart the process
      const newProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });
    }, 3000);
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  devProcess.kill('SIGINT');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  devProcess.kill('SIGINT');
  process.exit(1);
});

console.log('✅ Development server is running!');
console.log('🌐 Open http://localhost:8081 in your browser');
console.log('📝 Press Ctrl+C to stop the server');
console.log('');
