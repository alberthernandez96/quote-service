import dotenv from 'dotenv';
import { Server } from './setup';

dotenv.config();

let server: Server;

async function main() {
  server = new Server();
  await server.start();
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  if (server) {
    console.log('Shutting down server...');
    await server.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  if (server) {
    console.log('Shutting down server...');
    await server.shutdown();
  }
  process.exit(0);
});