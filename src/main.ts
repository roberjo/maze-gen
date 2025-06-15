import { MazeGenerator } from './core/MazeGenerator';
import { MazeRenderer, Theme, defaultTheme, lightTheme } from './visualization/MazeRenderer';
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
  private currentMaze: Cell[][] = [];
  private isAnimating: boolean = false;

  constructor() {
    this.canvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    
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
    this.generateMaze(10, 'dfs', 1); // Generate initial maze
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
      const animate = this.uiManager.getAnimationEnabled();
      
      this.generateMaze(size, algorithm, speed, animate);
    });

    this.uiManager.onSolveClick(() => {
      const animate = this.uiManager.getAnimationEnabled();
      this.solveMaze(animate);
    });

    this.uiManager.onThemeChange((theme: string) => {
      this.setTheme(theme);
    });

    this.uiManager.onAnimationSpeedChange((speed: number) => {
      this.mazeRenderer.setAnimationSpeed(speed);
    });
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement!;
    const size = Math.min(container.clientWidth, container.clientHeight) - 40;
    
    this.canvas.width = size;
    this.canvas.height = size;
  }

  private async generateMaze(size: number, algorithm: string, speed: number, animate: boolean = false): Promise<void> {
    if (this.isAnimating) {
      this.mazeRenderer.stopAnimation();
    }

    // Show loading state
    this.uiManager.setLoading(true, 'generate');
    this.uiManager.updateProgress(0);

    try {
      const startTime = performance.now();
      
      // Generate maze with progress updates
      this.currentMaze = await this.mazeGenerator.generate(size, algorithm, speed, (progress) => {
        this.uiManager.updateProgress(progress);
      });
      
      // Update stats
      const endTime = performance.now();
      this.uiManager.updateGenerationTime(endTime - startTime);
      
      // Render
      this.render(animate);

      // Show success message
      this.uiManager.showMessage('Maze generated successfully!', 'success');
    } catch (error) {
      // Show error message
      this.uiManager.showMessage('Failed to generate maze. Please try again.', 'error');
      console.error('Maze generation error:', error);
    } finally {
      // Hide loading state
      this.uiManager.setLoading(false, 'generate');
    }
  }

  private async solveMaze(animate: boolean = false): Promise<void> {
    if (!this.currentMaze.length) return;

    if (this.isAnimating) {
      this.mazeRenderer.stopAnimation();
    }

    // Show loading state
    this.uiManager.setLoading(true, 'solve');
    this.uiManager.updateProgress(0);

    try {
      const startTime = performance.now();
      
      // Solve maze with progress updates
      const solution = await this.mazeSolver.solve(this.currentMaze, (progress) => {
        this.uiManager.updateProgress(progress);
      });
      
      // Update stats
      const endTime = performance.now();
      this.uiManager.updatePathLength(solution.length);
      this.uiManager.updateNodesExplored(this.mazeSolver.getNodesExplored());
      
      // Render solution
      this.render(animate);

      // Show success message
      this.uiManager.showMessage('Maze solved successfully!', 'success');
    } catch (error) {
      // Show error message
      this.uiManager.showMessage('Failed to solve maze. Please try again.', 'error');
      console.error('Maze solving error:', error);
    } finally {
      // Hide loading state
      this.uiManager.setLoading(false, 'solve');
    }
  }

  private render(animate: boolean = false): void {
    if (!this.currentMaze.length) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render maze
    this.mazeRenderer.render(this.currentMaze, animate);
    this.isAnimating = animate;
    
    // Apply effects
    this.effectManager.applyEffects();
  }

  private setTheme(themeName: string): void {
    // Update UI theme
    document.documentElement.setAttribute('data-theme', themeName.toLowerCase());
    
    // Update maze renderer theme
    switch (themeName.toLowerCase()) {
      case 'light':
        this.mazeRenderer.setTheme(lightTheme);
        break;
      case 'dark':
      default:
        this.mazeRenderer.setTheme(defaultTheme);
        break;
    }
    this.render();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
}); 