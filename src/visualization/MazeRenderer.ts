import { Cell } from '../core/Cell';

export class MazeRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private wallThickness: number;
  private colors: {
    background: string;
    wall: string;
    start: string;
    end: string;
    solution: string;
    visited: string;
    current: string;
  };

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cellSize = 20;
    this.wallThickness = 2;
    this.colors = {
      background: '#1a1a1a',
      wall: '#3498db',
      start: '#2ecc71',
      end: '#e74c3c',
      solution: '#f1c40f',
      visited: '#34495e',
      current: '#9b59b6'
    };
  }

  public render(maze: Cell[][]): void {
    this.calculateCellSize(maze.length);
    this.clearCanvas();
    this.drawMaze(maze);
  }

  private calculateCellSize(mazeSize: number): void {
    const padding = 40;
    const availableWidth = this.canvas.width - padding;
    const availableHeight = this.canvas.height - padding;
    this.cellSize = Math.min(
      Math.floor(availableWidth / mazeSize),
      Math.floor(availableHeight / mazeSize)
    );
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawMaze(maze: Cell[][]): void {
    const offsetX = (this.canvas.width - maze[0].length * this.cellSize) / 2;
    const offsetY = (this.canvas.height - maze.length * this.cellSize) / 2;

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        const cellX = offsetX + x * this.cellSize;
        const cellY = offsetY + y * this.cellSize;

        this.drawCell(cell, cellX, cellY);
      }
    }
  }

  private drawCell(cell: Cell, x: number, y: number): void {
    // Draw cell background
    if (cell.isStart) {
      this.ctx.fillStyle = this.colors.start;
    } else if (cell.isEnd) {
      this.ctx.fillStyle = this.colors.end;
    } else if (cell.isSolution) {
      this.ctx.fillStyle = this.colors.solution;
    } else if (cell.isVisited) {
      this.ctx.fillStyle = this.colors.visited;
    } else {
      this.ctx.fillStyle = this.colors.background;
    }

    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

    // Draw walls
    this.ctx.strokeStyle = this.colors.wall;
    this.ctx.lineWidth = this.wallThickness;

    if (cell.walls.top) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + this.cellSize, y);
      this.ctx.stroke();
    }

    if (cell.walls.right) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.cellSize, y);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
      this.ctx.stroke();
    }

    if (cell.walls.bottom) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + this.cellSize);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
      this.ctx.stroke();
    }

    if (cell.walls.left) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + this.cellSize);
      this.ctx.stroke();
    }
  }

  public setColors(colors: Partial<typeof this.colors>): void {
    this.colors = { ...this.colors, ...colors };
  }

  public setCellSize(size: number): void {
    this.cellSize = size;
  }

  public setWallThickness(thickness: number): void {
    this.wallThickness = thickness;
  }
} 