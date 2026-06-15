import { Module } from '../Module';

export class ChatModule extends Module {
  constructor() {
    super('Chat');
  }

  protected onEnable(): void {
    console.log('[ChatModule] Enabled - Ready to handle chat messages');
  }

  protected onDisable(): void {
    console.log('[ChatModule] Disabled');
  }

  /**
   * Send a chat message
   */
  sendMessage(message: string): void {
    if (!this.enabled) {
      throw new Error('ChatModule is not enabled');
    }
    // TODO: Implement message sending
    console.log(`[Chat] Sending: ${message}`);
  }
}
