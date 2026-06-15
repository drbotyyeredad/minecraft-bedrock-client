import chalk from 'chalk';
import { Module } from './Module';

export class ModuleManager {
  private modules: Map<string, Module> = new Map();
  private enabledModules: Set<string> = new Set();

  /**
   * Register a module
   */
  register(name: string, module: Module): void {
    this.modules.set(name, module);
    console.log(chalk.green(`[ModuleManager] Registered module: ${name}`));
  }

  /**
   * Enable a module
   */
  enable(name: string): void {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module not found: ${name}`);
    }
    module.enable();
    this.enabledModules.add(name);
    console.log(chalk.blue(`[ModuleManager] Enabled: ${name}`));
  }

  /**
   * Disable a module
   */
  disable(name: string): void {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module not found: ${name}`);
    }
    module.disable();
    this.enabledModules.delete(name);
    console.log(chalk.yellow(`[ModuleManager] Disabled: ${name}`));
  }

  /**
   * Get a module
   */
  get(name: string): Module | undefined {
    return this.modules.get(name);
  }

  /**
   * List all modules
   */
  list(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * Get enabled modules
   */
  getEnabled(): string[] {
    return Array.from(this.enabledModules);
  }
}
