import { MazeGenerator } from '../src/core/MazeGenerator';
import { Cell } from '../src/core/Cell';

describe('MazeGenerator', () => {
  let generator: MazeGenerator;

  beforeEach(() => {
    generator = new MazeGenerator(true); // Enable test mode
  });

  test('should generate a maze with correct dimensions', async () => {
    const size = 10;
    const maze = await generator.generate(size, 'dfs', 1);
    
    expect(maze.length).toBe(size);
    expect(maze[0].length).toBe(size);
  });

  test('should have start and end points', async () => {
    const size = 10;
    const maze = await generator.generate(size, 'dfs', 1);
    
    let startFound = false;
    let endFound = false;

    for (const row of maze) {
      for (const cell of row) {
        if (cell.isStart) startFound = true;
        if (cell.isEnd) endFound = true;
      }
    }

    expect(startFound).toBe(true);
    expect(endFound).toBe(true);
  });

  test('should generate a valid maze with no isolated cells', async () => {
    const size = 10;
    const maze = await generator.generate(size, 'dfs', 1);
    
    // Check that each cell has at least one open wall
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = maze[y][x];
        const hasOpenWall = !cell.walls.top || !cell.walls.right || 
                          !cell.walls.bottom || !cell.walls.left;
        expect(hasOpenWall).toBe(true);
      }
    }
  });

  test('should generate different mazes with different algorithms', async () => {
    const size = 10;
    const dfsMaze = await generator.generate(size, 'dfs', 1);
    const primMaze = await generator.generate(size, 'prim', 1);
    const kruskalMaze = await generator.generate(size, 'kruskal', 1);

    // Check that at least one wall is different between the mazes
    let hasDifference = false;
    for (let y = 0; y < size && !hasDifference; y++) {
      for (let x = 0; x < size && !hasDifference; x++) {
        if (dfsMaze[y][x].walls.top !== primMaze[y][x].walls.top ||
            dfsMaze[y][x].walls.right !== primMaze[y][x].walls.right ||
            dfsMaze[y][x].walls.bottom !== primMaze[y][x].walls.bottom ||
            dfsMaze[y][x].walls.left !== primMaze[y][x].walls.left) {
          hasDifference = true;
        }
      }
    }

    expect(hasDifference).toBe(true);
  });

  test('should handle invalid algorithm gracefully', async () => {
    const size = 10;
    const maze = await generator.generate(size, 'invalid', 1);
    
    // Should default to DFS
    expect(maze.length).toBe(size);
    expect(maze[0].length).toBe(size);
  });
}); 