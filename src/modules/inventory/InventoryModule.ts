import { Module } from '../Module';

export interface Item {
  id: string;
  name: string;
  count: number;
  damage?: number;
  nbt?: any;
}

export class InventoryModule extends Module {
  private inventory: Item[] = new Array(36).fill(null);
  private hotbar: Item[] = new Array(9).fill(null);

  constructor() {
    super('Inventory');
  }

  protected onEnable(): void {
    console.log('[InventoryModule] Enabled - Inventory management ready');
  }

  protected onDisable(): void {
    console.log('[InventoryModule] Disabled');
  }

  /**
   * Get inventory
   */
  getInventory(): Item[] {
    return this.inventory;
  }

  /**
   * Get hotbar
   */
  getHotbar(): Item[] {
    return this.hotbar;
  }

  /**
   * Get item at slot
   */
  getItem(slot: number): Item | null {
    if (slot < 9) {
      return this.hotbar[slot];
    }
    return this.inventory[slot - 9];
  }

  /**
   * Find items by name
   */
  findItems(name: string): Item[] {
    return [
      ...this.hotbar,
      ...this.inventory
    ].filter((item) => item && item.name.includes(name));
  }
}
