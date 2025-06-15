import { MazeRenderer, Theme, defaultTheme, lightTheme } from '../../src/visualization/MazeRenderer';
import { Cell } from '../../src/core/Cell';

describe('MazeRenderer', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let renderer: MazeRenderer;
  let mockMaze: Cell[][];

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d')!;
    renderer = new MazeRenderer(canvas, ctx);
    
    // Create a 2x2 mock maze
    mockMaze = [
      [new Cell(0, 0), new Cell(0, 1)],
      [new Cell(1, 0), new Cell(1, 1)]
    ];
  });

  describe('Theme Support', () => {
    it('should use default theme by default', () => {
      expect(renderer['colors']).toEqual(defaultTheme);
    });

    it('should accept custom theme in constructor', () => {
      const customTheme: Theme = {
        background: '#000000',
        wall: '#ffffff',
        start: '#ff0000',
        end: '#00ff00',
        solution: '#0000ff',
        visited: '#888888',
        current: '#ffff00'
      };
      
      const customRenderer = new MazeRenderer(canvas, ctx, customTheme);
      expect(customRenderer['colors']).toEqual(customTheme);
    });

    it('should allow theme changes after initialization', () => {
      renderer.setTheme(lightTheme);
      expect(renderer['colors']).toEqual(lightTheme);
    });
  });

  describe('Animation Support', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render maze without animation when animate is false', () => {
      const spy = jest.spyOn(renderer as any, 'drawMaze');
      renderer.render(mockMaze, false);
      expect(spy).toHaveBeenCalledWith(mockMaze);
      expect(renderer['animationFrameId']).toBeNull();
    });

    it('should start animation when animate is true', () => {
      const spy = jest.spyOn(renderer as any, 'animateMaze');
      renderer.render(mockMaze, true);
      expect(spy).toHaveBeenCalledWith(mockMaze);
      expect(renderer['animationFrameId']).not.toBeNull();
    });

    it('should stop animation when stopAnimation is called', () => {
      renderer.render(mockMaze, true);
      expect(renderer['animationFrameId']).not.toBeNull();
      
      renderer.stopAnimation();
      expect(renderer['animationFrameId']).toBeNull();
    });

    it('should respect animation speed setting', () => {
      const customSpeed = 100;
      renderer.setAnimationSpeed(customSpeed);
      expect(renderer['animationSpeed']).toBe(customSpeed);
    });

    it('should not allow negative animation speed', () => {
      renderer.setAnimationSpeed(-50);
      expect(renderer['animationSpeed']).toBe(0);
    });
  });

  describe('Rendering', () => {
    it('should calculate cell size based on canvas dimensions', () => {
      renderer.render(mockMaze);
      const expectedCellSize = Math.min(
        Math.floor((canvas.width - 40) / mockMaze.length),
        Math.floor((canvas.height - 40) / mockMaze.length)
      );
      expect(renderer['cellSize']).toBe(expectedCellSize);
    });

    it('should clear canvas before rendering', () => {
      const spy = jest.spyOn(ctx, 'fillRect');
      renderer.render(mockMaze);
      expect(spy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });
}); 