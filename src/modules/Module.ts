/**
 * Base class for all modules/mods
 */
export abstract class Module {
  protected name: string;
  protected enabled: boolean = false;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Get module name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Check if module is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable the module
   */
  enable(): void {
    this.enabled = true;
    this.onEnable();
  }

  /**
   * Disable the module
   */
  disable(): void {
    this.enabled = false;
    this.onDisable();
  }

  /**
   * Called when module is enabled
   */
  protected onEnable(): void {}

  /**
   * Called when module is disabled
   */
  protected onDisable(): void {}
}
