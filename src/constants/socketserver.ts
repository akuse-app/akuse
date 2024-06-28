// SocketService.ts

import io, { Socket } from 'socket.io-client';

interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  roomCodeGenerated: (roomCode: string) => void;
  roomJoined: () => void;
  roomJoinFailed: () => void;
}

class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | null = null;

  private constructor(url: string) {
    // Initialize socket connection
    this.socket = io(url);
  }

  public static getInstance(url: string): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(url);
      console.log(SocketService.instance)
    }
    return SocketService.instance;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public connect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: SocketEvents[keyof SocketEvents]) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error('Socket is not connected');
    }
  }

  public once(event: string, callback: SocketEvents[keyof SocketEvents]) {
    if (this.socket) {
      this.socket.once(event, callback);
    }else{
      console.error('Socket is not connected');
    }
  }

  // Other methods as needed

}

export default SocketService;
