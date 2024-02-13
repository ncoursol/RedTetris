import { inject } from 'vue';
import io from 'socket.io-client';

const socketSymbol = Symbol();

export function useSocket() {
  const socket = inject(socketSymbol);

  if (!socket) {
    throw new Error('Socket instance not found. Did you forget to provide it?');
  }

  return { socket };
}

export default {
  install(app, options) {
    const { url } = options || {};
    const socket = io(url || 'http://localhost:3000');

    app.provide(socketSymbol, socket);
  }
};