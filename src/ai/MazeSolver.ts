import { Cell } from '../core/Cell';

export class MazeSolver {
  private nodesExplored: number = 0;
  private solvingSpeed: number = 1;

  constructor() {}

  public async solve(maze: Cell[][]): Promise<Cell[]> {
    this.nodesExplored = 0;
    const start = this.findStart(maze);
    const end = this.findEnd(maze);
    
    if (!start || !end) {
      throw new Error('Start or end cell not found');
    }

    // Reset all cells
    for (const row of maze) {
      for (const cell of row) {
        cell.reset();
      }
    }

    // Use A* algorithm
    const solution = await this.aStar(maze, start, end);
    
    // Mark solution path
    if (solution) {
      let current = end;
      while (current.parent) {
        current.isSolution = true;
        current = current.parent;
      }
      start.isSolution = true;
    }

    return solution || [];
  }

  public getNodesExplored(): number {
    return this.nodesExplored;
  }

  public setSolvingSpeed(speed: number): void {
    this.solvingSpeed = speed;
  }

  private findStart(maze: Cell[][]): Cell | null {
    for (const row of maze) {
      for (const cell of row) {
        if (cell.isStart) {
          return cell;
        }
      }
    }
    return null;
  }

  private findEnd(maze: Cell[][]): Cell | null {
    for (const row of maze) {
      for (const cell of row) {
        if (cell.isEnd) {
          return cell;
        }
      }
    }
    return null;
  }

  private async aStar(maze: Cell[][], start: Cell, end: Cell): Promise<Cell[]> {
    const openSet: Cell[] = [start];
    const closedSet: Set<Cell> = new Set();
    
    start.distance = 0;
    start.parent = null;

    while (openSet.length > 0) {
      // Find cell with lowest f score
      const current = this.getLowestFScore(openSet, end);
      
      if (current.equals(end)) {
        return this.reconstructPath(current);
      }

      // Move current from open to closed set
      const currentIndex = openSet.indexOf(current);
      openSet.splice(currentIndex, 1);
      closedSet.add(current);
      current.isVisited = true;
      this.nodesExplored++;

      // Check neighbors
      for (const neighbor of current.getNeighbors(maze)) {
        if (closedSet.has(neighbor)) {
          continue;
        }

        const tentativeDistance = current.distance + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeDistance >= neighbor.distance) {
          continue;
        }

        neighbor.parent = current;
        neighbor.distance = tentativeDistance;

        await this.delay();
      }
    }

    return []; // No path found
  }

  private getLowestFScore(cells: Cell[], end: Cell): Cell {
    return cells.reduce((lowest, current) => {
      const currentF = current.distance + this.heuristic(current, end);
      const lowestF = lowest.distance + this.heuristic(lowest, end);
      return currentF < lowestF ? current : lowest;
    });
  }

  private heuristic(cell: Cell, end: Cell): number {
    // Manhattan distance
    return Math.abs(cell.x - end.x) + Math.abs(cell.y - end.y);
  }

  private reconstructPath(end: Cell): Cell[] {
    const path: Cell[] = [];
    let current: Cell | null = end;

    while (current) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  }

  private delay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 100 / this.solvingSpeed);
    });
  }
} 