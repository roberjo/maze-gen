import { Cell } from '../src/core/Cell';

describe('Cell', () => {
  it('should reset its state', () => {
    const cell = new Cell(1, 2);
    cell.isVisited = true;
    cell.isSolution = true;
    cell.distance = 5;
    cell.parent = new Cell(0, 0);
    cell.reset();
    expect(cell.isVisited).toBe(false);
    expect(cell.isSolution).toBe(false);
    expect(cell.distance).toBe(Infinity);
    expect(cell.parent).toBeNull();
  });

  it('should return correct neighbors based on open walls', () => {
    // Create a 3x3 maze
    const maze: Cell[][] = [];
    for (let y = 0; y < 3; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        row.push(new Cell(x, y));
      }
      maze.push(row);
    }
    // Open right wall for (1,1)
    maze[1][1].walls.right = false;
    // Open bottom wall for (1,1)
    maze[1][1].walls.bottom = false;
    // Open left wall for (1,1)
    maze[1][1].walls.left = false;
    // Open top wall for (1,1)
    maze[1][1].walls.top = false;
    const neighbors = maze[1][1].getNeighbors(maze);
    expect(neighbors).toContain(maze[1][0]); // left
    expect(neighbors).toContain(maze[1][2]); // right
    expect(neighbors).toContain(maze[0][1]); // top
    expect(neighbors).toContain(maze[2][1]); // bottom
    expect(neighbors.length).toBe(4);
  });

  it('should compare equality based on coordinates', () => {
    const cellA = new Cell(2, 3);
    const cellB = new Cell(2, 3);
    const cellC = new Cell(1, 3);
    expect(cellA.equals(cellB)).toBe(true);
    expect(cellA.equals(cellC)).toBe(false);
  });

  it('should return a string representation', () => {
    const cell = new Cell(4, 5);
    expect(cell.toString()).toBe('Cell(4, 5)');
  });
}); 