import { Cell } from './Cell';
import { Direction } from './Direction';

export class MazeGenerator {
  private maze: Cell[][] = [];
  private size: number = 0;
  private currentCell: Cell | null = null;
  private stack: Cell[] = [];
  private visited: Set<Cell> = new Set();
  private generationSpeed: number = 1;
  private isTestMode: boolean = false;
  private totalCells: number = 0;
  private processedCells: number = 0;

  constructor(isTestMode: boolean = false) {
    this.isTestMode = isTestMode;
  }

  public async generate(
    size: number,
    algorithm: string,
    speed: number,
    onProgress?: (progress: number) => void
  ): Promise<Cell[][]> {
    this.size = size;
    this.generationSpeed = speed;
    this.initializeMaze();
    this.totalCells = size * size;
    this.processedCells = 0;

    switch (algorithm) {
      case 'dfs':
        await this.generateDFS(onProgress);
        break;
      case 'prim':
        await this.generatePrim(onProgress);
        break;
      case 'kruskal':
        await this.generateKruskal(onProgress);
        break;
      default:
        await this.generateDFS(onProgress);
    }

    return this.maze;
  }

  public getMaze(): Cell[][] {
    return this.maze;
  }

  private initializeMaze(): void {
    this.maze = [];
    this.stack = [];
    this.visited.clear();

    // Create grid of cells
    for (let y = 0; y < this.size; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.size; x++) {
        row.push(new Cell(x, y));
      }
      this.maze.push(row);
    }

    // Set start and end points
    this.maze[0][0].isStart = true;
    this.maze[this.size - 1][this.size - 1].isEnd = true;
  }

  private async generateDFS(onProgress?: (progress: number) => void): Promise<void> {
    const startCell = this.maze[0][0];
    this.currentCell = startCell;
    this.visited.add(startCell);
    this.stack.push(startCell);
    this.updateProgress(onProgress);

    while (this.stack.length > 0) {
      this.currentCell = this.stack[this.stack.length - 1];
      const unvisitedNeighbors = this.getUnvisitedNeighbors(this.currentCell);

      if (unvisitedNeighbors.length > 0) {
        const nextCell = this.getRandomNeighbor(unvisitedNeighbors);
        this.removeWallsBetween(this.currentCell, nextCell);
        this.visited.add(nextCell);
        this.stack.push(nextCell);
        this.updateProgress(onProgress);
      } else {
        this.stack.pop();
      }

      await this.delay();
    }
  }

  private async generatePrim(onProgress?: (progress: number) => void): Promise<void> {
    const startCell = this.maze[0][0];
    this.visited.add(startCell);
    const walls = this.getWalls(startCell);
    this.updateProgress(onProgress);

    while (walls.length > 0) {
      const randomWall = walls[Math.floor(Math.random() * walls.length)];
      const { cell1, cell2 } = randomWall;

      if (this.visited.has(cell1) !== this.visited.has(cell2)) {
        this.removeWallsBetween(cell1, cell2);
        const unvisitedCell = this.visited.has(cell1) ? cell2 : cell1;
        this.visited.add(unvisitedCell);
        walls.push(...this.getWalls(unvisitedCell));
        this.updateProgress(onProgress);
      }

      const wallIndex = walls.indexOf(randomWall);
      walls.splice(wallIndex, 1);

      await this.delay();
    }
  }

  private async generateKruskal(onProgress?: (progress: number) => void): Promise<void> {
    const walls: { cell1: Cell; cell2: Cell }[] = [];
    const sets: Set<Cell>[] = [];

    // Initialize sets
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = this.maze[y][x];
        const set = new Set<Cell>([cell]);
        sets.push(set);
      }
    }

    // Collect all walls
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = this.maze[y][x];
        if (x < this.size - 1) {
          walls.push({ cell1: cell, cell2: this.maze[y][x + 1] });
        }
        if (y < this.size - 1) {
          walls.push({ cell1: cell, cell2: this.maze[y + 1][x] });
        }
      }
    }

    // Shuffle walls
    for (let i = walls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [walls[i], walls[j]] = [walls[j], walls[i]];
    }

    // Process walls
    for (const wall of walls) {
      const set1 = sets.find(set => set.has(wall.cell1))!;
      const set2 = sets.find(set => set.has(wall.cell2))!;

      if (set1 !== set2) {
        this.removeWallsBetween(wall.cell1, wall.cell2);
        const newSet = new Set([...set1, ...set2]);
        sets.splice(sets.indexOf(set1), 1);
        sets.splice(sets.indexOf(set2), 1);
        sets.push(newSet);
        this.updateProgress(onProgress);
      }

      await this.delay();
    }
  }

  private getUnvisitedNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (x > 0 && !this.visited.has(this.maze[y][x - 1])) {
      neighbors.push(this.maze[y][x - 1]);
    }
    if (x < this.size - 1 && !this.visited.has(this.maze[y][x + 1])) {
      neighbors.push(this.maze[y][x + 1]);
    }
    if (y > 0 && !this.visited.has(this.maze[y - 1][x])) {
      neighbors.push(this.maze[y - 1][x]);
    }
    if (y < this.size - 1 && !this.visited.has(this.maze[y + 1][x])) {
      neighbors.push(this.maze[y + 1][x]);
    }

    return neighbors;
  }

  private getRandomNeighbor(neighbors: Cell[]): Cell {
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  private getWalls(cell: Cell): { cell1: Cell; cell2: Cell }[] {
    const walls: { cell1: Cell; cell2: Cell }[] = [];
    const { x, y } = cell;

    if (x > 0) {
      walls.push({ cell1: cell, cell2: this.maze[y][x - 1] });
    }
    if (x < this.size - 1) {
      walls.push({ cell1: cell, cell2: this.maze[y][x + 1] });
    }
    if (y > 0) {
      walls.push({ cell1: cell, cell2: this.maze[y - 1][x] });
    }
    if (y < this.size - 1) {
      walls.push({ cell1: cell, cell2: this.maze[y + 1][x] });
    }

    return walls;
  }

  private removeWallsBetween(cell1: Cell, cell2: Cell): void {
    const dx = cell2.x - cell1.x;
    const dy = cell2.y - cell1.y;

    if (dx === 1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    } else if (dx === -1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    }

    if (dy === 1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    } else if (dy === -1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    }
  }

  private updateProgress(onProgress?: (progress: number) => void): void {
    if (onProgress) {
      this.processedCells++;
      const progress = Math.round((this.processedCells / this.totalCells) * 100);
      onProgress(progress);
    }
  }

  private async delay(): Promise<void> {
    if (!this.isTestMode) {
      const delayTime = Math.max(1, 100 / this.generationSpeed);
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
  }
} 