import { Point } from "../interfaces/Point";
import { TileState } from "../enums/TileState";

export function isWall(grid: TileState[][], point: Point): boolean {
  return grid[point.row][point.col] === TileState.WALL;
}

export function isValid(point: Point, grid: TileState[][]) {
  const height = grid.length;
  const width = grid[0].length;
  return (
    point.row >= 0 && point.col >= 0 && point.row < height && point.col < width
  );
}

export function isVisited(visitedTiles: Point[], point: Point): boolean {
  const visited = !!visitedTiles.filter(
    (p) => p.row === point.row && p.col === point.col
  ).length;
  return visited;
}

export function getNeighbors(location: Point, grid: TileState[][]): Point[] {
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
    if (isValid(point, grid)) neighbors.push(point);
  }
  return neighbors;
}

export function isDestination(point: Point, destination: Point): boolean {
  return point.row === destination.row && point.col === destination.col;
}
