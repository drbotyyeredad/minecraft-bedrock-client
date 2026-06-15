import { EventEmitter } from 'eventemitter3';
import { ConnectionManager } from './ConnectionManager';
import { PacketHandler } from './PacketHandler';
import { ModuleManager } from '../modules/ModuleManager';
import chalk from 'chalk';

export interface ClientOptions {
  host: string;
  port: number;
  username: string;
  password?: string;
  offline?: boolean;
}

export class BedrockClient extends EventEmitter {
  private connectionManager: ConnectionManager;
  private packetHandler: PacketHandler;
  private moduleManager: ModuleManager;
  private isConnected: boolean = false;

  constructor() {
    super();
    this.connectionManager = new ConnectionManager();
    this.packetHandler = new PacketHandler();
    this.moduleManager = new ModuleManager();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.connectionManager.on('connected', () => {
      this.isConnected = true;
      console.log(chalk.green('✓ Connected to server'));
      this.emit('connected');
    });

    this.connectionManager.on('disconnected', () => {
      this.isConnected = false;
      console.log(chalk.yellow('✗ Disconnected from server'));
      this.emit('disconnected');
    });

    this.connectionManager.on('packet', (packet) => {
      this.packetHandler.handle(packet);
      this.emit('packet', packet);
    });
  }

  /**
   * Connect to a Bedrock server
   */
  async connect(options: ClientOptions): Promise<void> {
    try {
      console.log(chalk.blue(`Connecting to ${options.host}:${options.port}...`));
      await this.connectionManager.connect(options);
    } catch (error) {
      console.error(chalk.red('Connection failed:'), error);
      throw error;
    }
  }

  /**
   * Disconnect from the server
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.connectionManager.disconnect();
    }
  }

  /**
   * Send a packet to the server
   */
  sendPacket(packet: any): void {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }
    this.connectionManager.sendPacket(packet);
  }

  /**
   * Get the module manager for loading mods
   */
  getModuleManager(): ModuleManager {
    return this.moduleManager;
  }

  /**
   * Check if connected
   */
  connected(): boolean {
    return this.isConnected;
  }
}
