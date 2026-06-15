import { Module } from '../Module';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  yaw: number;   // Horizontal rotation (-180 to 180)
  pitch: number; // Vertical rotation (-90 to 90)
}

export class MovementModule extends Module {
  private position: Vec3 = { x: 0, y: 0, z: 0 };
  private rotation: Rotation = { yaw: 0, pitch: 0 };
  private velocity: Vec3 = { x: 0, y: 0, z: 0 };

  constructor() {
    super('Movement');
  }

  protected onEnable(): void {
    console.log('[MovementModule] Enabled - Ready for movement control');
  }

  protected onDisable(): void {
    console.log('[MovementModule] Disabled');
  }

  /**
   * Get current position
   */
  getPosition(): Vec3 {
    return { ...this.position };
  }

  /**
   * Set position
   */
  setPosition(pos: Vec3): void {
    if (!this.enabled) return;
    this.position = pos;
  }

  /**
   * Get rotation
   */
  getRotation(): Rotation {
    return { ...this.rotation };
  }

  /**
   * Set rotation
   */
  setRotation(rot: Rotation): void {
    if (!this.enabled) return;
    this.rotation = rot;
  }

  /**
   * Move forward
   */
  moveForward(speed: number = 1): void {
    if (!this.enabled) return;
    // TODO: Calculate movement based on rotation
  }

  /**
   * Jump
   */
  jump(): void {
    if (!this.enabled) return;
    this.velocity.y = 0.42; // Minecraft jump velocity
  }
}
