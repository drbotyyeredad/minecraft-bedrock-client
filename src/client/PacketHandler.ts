import chalk from 'chalk';

export class PacketHandler {
  private handlers: Map<string, Function> = new Map();

  constructor() {
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Register handlers for common packets
    this.register('text', this.handleTextPacket.bind(this));
    this.register('player_list', this.handlePlayerListPacket.bind(this));
    this.register('login', this.handleLoginPacket.bind(this));
  }

  /**
   * Register a packet handler
   */
  register(packetName: string, handler: (packet: any) => void): void {
    this.handlers.set(packetName, handler);
    console.log(chalk.dim(`[PacketHandler] Registered handler for: ${packetName}`));
  }

  /**
   * Handle incoming packet
   */
  handle(packet: any): void {
    const handler = this.handlers.get(packet.name);
    if (handler) {
      handler(packet);
    } else {
      console.log(chalk.dim(`[PacketHandler] No handler for packet: ${packet.name}`));
    }
  }

  private handleTextPacket(packet: any): void {
    console.log(chalk.green(`[Chat] ${packet.source}: ${packet.message}`));
  }

  private handlePlayerListPacket(packet: any): void {
    console.log(chalk.cyan(`[Players] List updated: ${packet.players.length} players`));
  }

  private handleLoginPacket(packet: any): void {
    console.log(chalk.green('[Login] Successfully logged in'));
  }
}
