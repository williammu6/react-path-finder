import { TileState } from "../enums/TileState";
import { Point } from "../interfaces/Point";
import {
  isWall,
  isVisited,
  getNeighbors,
  isDestination,
} from "../utils/pathFinding";

const getPath = (
  traversalTree: Point[][],
  point: Point,
  path: Point[] = []
): Point[] => {
  if (!traversalTree[point.row][point.col]) return path.reverse();

  path.push(point);

  return getPath(traversalTree, traversalTree[point.row][point.col], path);
};

const Dijkstra = (grid: TileState[][], origin: Point, destination: Point) => {
  let visitedTiles: Point[] = [];

  const width = grid[0].length;
  const height = grid.length;

  var traversalTree: Point[][] = Array.from({ length: height }, () =>
    Array.from({ length: width })
  );

  let q: Point[] = [];

  q.push(origin);

  while (q.length) {
    const currentLocation = q.shift() as Point;

    visitedTiles.push(currentLocation);

    const neighbors = getNeighbors(currentLocation, grid);

    for (let neighbor of neighbors) {
      if (!isVisited(visitedTiles, neighbor)) {
        visitedTiles.push(neighbor);
        traversalTree[neighbor.row][neighbor.col] = currentLocation;
        if (isDestination(neighbor, destination))
          return [visitedTiles, getPath(traversalTree, destination)];

        if (!isWall(grid, neighbor)) q.push(neighbor);
      }
    }
  }
  return [visitedTiles, []];
};

export default Dijkstra;
