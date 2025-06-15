import { MazeGenerator } from './core/MazeGenerator';
import { MazeRenderer } from './visualization/MazeRenderer';
import { MazeSolver } from './ai/MazeSolver';
import { EffectManager } from './effects/EffectManager';
import { UIManager } from './ui/UIManager';

class App {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mazeGenerator: MazeGenerator;
  private mazeRenderer: MazeRenderer;
  private mazeSolver: MazeSolver;
  private effectManager: EffectManager;
  private uiManager: UIManager;

  constructor() {
    this.canvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Initialize components
    this.mazeGenerator = new MazeGenerator();
    this.mazeRenderer = new MazeRenderer(this.canvas, this.ctx);
    this.mazeSolver = new MazeSolver();
    this.effectManager = new EffectManager(this.canvas, this.ctx);
    this.uiManager = new UIManager();

    // Set up event listeners
    this.setupEventListeners();
    
    // Initial render
    this.resizeCanvas();
    this.render();
  }

  private setupEventListeners(): void {
    // Window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.render();
    });

    // UI controls
    this.uiManager.onGenerateClick(() => {
      const size = this.uiManager.getMazeSize();
      const algorithm = this.uiManager.getAlgorithm();
      const speed = this.uiManager.getSpeed();
      
      this.generateMaze(size, algorithm, speed);
    });

    this.uiManager.onSolveClick(() => {
      this.solveMaze();
    });
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement!;
    const size = Math.min(container.clientWidth, container.clientHeight) - 40;
    
    this.canvas.width = size;
    this.canvas.height = size;
  }

  private async generateMaze(size: number, algorithm: string, speed: number): Promise<void> {
    const startTime = performance.now();
    
    // Generate maze
    const maze = await this.mazeGenerator.generate(size, algorithm, speed);
    
    // Update stats
    const endTime = performance.now();
    this.uiManager.updateGenerationTime(endTime - startTime);
    
    // Render
    this.render();
  }

  private async solveMaze(): Promise<void> {
    const startTime = performance.now();
    
    // Solve maze
    const solution = await this.mazeSolver.solve(this.mazeGenerator.getMaze());
    
    // Update stats
    const endTime = performance.now();
    this.uiManager.updatePathLength(solution.length);
    this.uiManager.updateNodesExplored(this.mazeSolver.getNodesExplored());
    
    // Render solution
    this.render();
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render maze
    this.mazeRenderer.render(this.mazeGenerator.getMaze());
    
    // Apply effects
    this.effectManager.applyEffects();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
}); 