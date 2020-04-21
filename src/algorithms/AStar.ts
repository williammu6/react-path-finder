import { TileState } from "../enums/TileState";
import { Point } from "../interfaces/Point";

const AStar = (grid: TileState[][], origin: Point, destination: Point) => {
  let visitedTiles: Point[] = [];
  let pathTiles: Point[] = [];

  const width = grid[0].length;
  const height = grid.length;

  var traversalTree: Point[][] = Array.from({ length: height }, () =>
    Array.from({ length: width })
  );

  let q: Point[] = [];

  q.push(origin);

  const isWall = (grid: TileState[][], point: Point): boolean => {
    return grid[point.row][point.col] === TileState.WALL;
  };

  const isValid = (point: Point) => {
    return (
      point.row >= 0 &&
      point.col >= 0 &&
      point.row < height &&
      point.col < width
    );
  };

  const isVisited = (visitedTiles: Point[], point: Point): boolean => {
    const visited = !!visitedTiles.filter(
      (p) => p.row === point.row && p.col === point.col
    ).length;
    return visited;
  };

  const getNeighbors = (grid: TileState[][], location: Point): Point[] => {
    let neighbors: Point[] = [];
    const directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    for (let dir of directions) {
      const point: Point = {
        row: location.row + dir[0],
        col: location.col + dir[1],
      };
      if (isValid(point)) neighbors.push(point);
    }
    return neighbors;
  };

  const getOptimalPath = (traversalTree: Point[][], point: Point): Point[] => {
    if (!traversalTree[point.row][point.col]) return pathTiles.reverse();

    pathTiles.push(point);

    return getOptimalPath(traversalTree, traversalTree[point.row][point.col]);
  };

  while (q.length) {
    const currentLocation = q.shift() as Point;

    visitedTiles.push(currentLocation);

    const neighbors = getNeighbors(grid, currentLocation);

    for (let neighbor of neighbors) {
      if (!isVisited(visitedTiles, neighbor)) {
        visitedTiles.push(neighbor);
        traversalTree[neighbor.row][neighbor.col] = currentLocation;
        if (
          neighbor.col === destination.col &&
          neighbor.row === destination.row
        ) {
          return [visitedTiles, getOptimalPath(traversalTree, destination)];
        }
        if (!isWall(grid, neighbor)) q.push(neighbor);
      }
    }
  }
  return [visitedTiles, getOptimalPath(traversalTree, destination)];
};

export default AStar;
