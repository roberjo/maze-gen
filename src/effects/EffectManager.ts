import { Cell } from '../core/Cell';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export class EffectManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private lightSources: { x: number; y: number; intensity: number }[] = [];
  private isLightingEnabled: boolean = true;
  private isParticlesEnabled: boolean = true;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.initializeLightSources();
  }

  private initializeLightSources(): void {
    // Add light sources at start and end points
    this.lightSources = [
      { x: 0, y: 0, intensity: 0.8 },
      { x: 1, y: 1, intensity: 0.8 }
    ];
  }

  public applyEffects(): void {
    if (this.isLightingEnabled) {
      this.applyLighting();
    }
    if (this.isParticlesEnabled) {
      this.updateParticles();
      this.renderParticles();
    }
  }

  private applyLighting(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const i = (y * this.canvas.width + x) * 4;
        
        // Calculate lighting intensity
        let intensity = 0.3; // Ambient light
        for (const source of this.lightSources) {
          const dx = x - source.x * this.canvas.width;
          const dy = y - source.y * this.canvas.height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const lightIntensity = source.intensity * (1 - distance / (this.canvas.width * 0.5));
          intensity += Math.max(0, lightIntensity);
        }

        // Apply lighting to RGB channels
        data[i] *= intensity;     // R
        data[i + 1] *= intensity; // G
        data[i + 2] *= intensity; // B
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  public addParticles(x: number, y: number, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      const life = 30 + Math.random() * 30;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      });
    }
  }

  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private renderParticles(): void {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      this.ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public updateLightSource(index: number, x: number, y: number): void {
    if (this.lightSources[index]) {
      this.lightSources[index].x = x;
      this.lightSources[index].y = y;
    }
  }

  public toggleLighting(): void {
    this.isLightingEnabled = !this.isLightingEnabled;
  }

  public toggleParticles(): void {
    this.isParticlesEnabled = !this.isParticlesEnabled;
  }

  public clearParticles(): void {
    this.particles = [];
  }
} 