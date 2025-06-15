import { MazeSolver } from '../src/ai/MazeSolver';
import { Cell } from '../src/core/Cell';
import { MazeGenerator } from '../src/core/MazeGenerator';

describe('MazeSolver', () => {
  let solver: MazeSolver;
  let generator: MazeGenerator;

  beforeEach(() => {
    solver = new MazeSolver();
    generator = new MazeGenerator(true);
  });

  test('should find a path in a simple maze', async () => {
    // Create a simple 3x3 maze with a clear path
    const maze: Cell[][] = [];
    for (let y = 0; y < 3; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        const cell = new Cell(x, y);
        // Remove walls to create a simple path
        if (x < 2) cell.walls.right = false;
        if (y < 2) cell.walls.bottom = false;
        row.push(cell);
      }
      maze.push(row);
    }

    // Set start and end points
    maze[0][0].isStart = true;
    maze[2][2].isEnd = true;

    const solution = await solver.solve(maze);
    expect(solution.length).toBeGreaterThan(0);
  });

  test('should find the shortest path', async () => {
    const size = 5;
    const maze = await generator.generate(size, 'dfs', 1);
    const solution = await solver.solve(maze);

    // The shortest path should be at least the Manhattan distance
    const manhattanDistance = 2 * (size - 1);
    expect(solution.length).toBeGreaterThanOrEqual(manhattanDistance);
  });

  test('should mark visited cells', async () => {
    const size = 5;
    const maze = await generator.generate(size, 'dfs', 1);
    await solver.solve(maze);

    let visitedCount = 0;
    for (const row of maze) {
      for (const cell of row) {
        if (cell.isVisited) visitedCount++;
      }
    }

    expect(visitedCount).toBeGreaterThan(0);
  });

  test('should mark solution path', async () => {
    const size = 5;
    const maze = await generator.generate(size, 'dfs', 1);
    await solver.solve(maze);

    let solutionCount = 0;
    for (const row of maze) {
      for (const cell of row) {
        if (cell.isSolution) solutionCount++;
      }
    }

    expect(solutionCount).toBeGreaterThan(0);
  });

  test('should handle unsolvable maze', async () => {
    // Create an unsolvable maze by making all walls solid
    const maze: Cell[][] = [];
    for (let y = 0; y < 3; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        const cell = new Cell(x, y);
        row.push(cell);
      }
      maze.push(row);
    }

    maze[0][0].isStart = true;
    maze[2][2].isEnd = true;

    const solution = await solver.solve(maze);
    expect(solution.length).toBe(0);
  });

  test('should track nodes explored', async () => {
    const size = 5;
    const maze = await generator.generate(size, 'dfs', 1);
    await solver.solve(maze);

    const nodesExplored = solver.getNodesExplored();
    expect(nodesExplored).toBeGreaterThan(0);
  });
}); 