export class Cell {
  public x: number;
  public y: number;
  public walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  public isStart: boolean;
  public isEnd: boolean;
  public isVisited: boolean;
  public isSolution: boolean;
  public distance: number;
  public parent: Cell | null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    this.isStart = false;
    this.isEnd = false;
    this.isVisited = false;
    this.isSolution = false;
    this.distance = Infinity;
    this.parent = null;
  }

  public reset(): void {
    this.isVisited = false;
    this.isSolution = false;
    this.distance = Infinity;
    this.parent = null;
  }

  public getNeighbors(maze: Cell[][]): Cell[] {
    const neighbors: Cell[] = [];
    const size = maze.length;

    // Check top neighbor
    if (this.y > 0 && !this.walls.top) {
      neighbors.push(maze[this.y - 1][this.x]);
    }

    // Check right neighbor
    if (this.x < size - 1 && !this.walls.right) {
      neighbors.push(maze[this.y][this.x + 1]);
    }

    // Check bottom neighbor
    if (this.y < size - 1 && !this.walls.bottom) {
      neighbors.push(maze[this.y + 1][this.x]);
    }

    // Check left neighbor
    if (this.x > 0 && !this.walls.left) {
      neighbors.push(maze[this.y][this.x - 1]);
    }

    return neighbors;
  }

  public equals(other: Cell): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public toString(): string {
    return `Cell(${this.x}, ${this.y})`;
  }
} 