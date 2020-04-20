import { TileStatus } from "../enums/TileStatus";
import { Point } from "../interfaces/Point";

const Dijkstra = (grid: TileStatus[][], origin: Point, destination: Point) => {
  let visitedTiles: Point[] = [];
  let pathTiles: Point[] = [];

  const width = grid[0].length;
  const height = grid.length;

  let q: Point[] = [];

  q.push(origin);

  const isValid = (point: Point) => {
    return (
      point.row >= 0 &&
      point.col >= 0 &&
      point.row < width &&
      point.col < height
    );
  };

  const isVisited = (point: Point): boolean => {
    const visited = !!visitedTiles.filter(
      (p) => p.row === point.row && p.col === point.col
    ).length;
    return visited;
  };

  const getNeighbors = (grid: TileStatus[][], location: Point): Point[] => {
    let neighbors: Point[] = [];
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];

    for (let dir of directions) {
      const point: Point = {
        row: location.row + dir[0],
        col: location.col + dir[1],
      };
      if (isValid(point)) {
        neighbors.push(point);
      }
    }
    return neighbors;
  };

  while (q.length) {
    const currentLocation = q.shift() as Point;
    visitedTiles.push(currentLocation);
    const neighbors = getNeighbors(grid, currentLocation);
    for (let neighbor of neighbors) {
      if (!isVisited(neighbor)) {
        if (neighbor === destination) {
          // Is destination
          return [visitedTiles, pathTiles];
        } else {
          // Is not destination
          q.push(neighbor);
        }
      }
    }
    if (visitedTiles.length > 300) break;
  }

  return [visitedTiles, pathTiles];
};

export default Dijkstra;
