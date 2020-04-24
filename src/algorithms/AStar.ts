import { TileState } from "../enums/TileState";
import { Point } from "../interfaces/Point";

interface Costs {
  H: number;
  F: number;
  G: number;
}

const AStar = (grid: TileState[][], origin: Point, destination: Point) => {
  let visitedTiles: Point[] = [];
  let pathTiles: Point[] = [];

  const width = grid[0].length;
  const height = grid.length;

  var traversalTree: Point[][] = Array.from({ length: height }, () =>
    Array.from({ length: width })
  );

  let q = [];

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

  const getNeighbors = (location: Point): Point[] => {
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

  const isDestination = (point: Point): boolean => {
    return point.row === destination.row && point.col === destination.col;
  };

  const calculateH = (point: Point, target: Point): number => {
    return (Math.abs(point.col-target.col) + (Math.abs(point.row - target.row)));
  }
  var costs: Costs[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({H: 1e9, F: 1e9, G: 1e9}) )
  );

  const calculateCost = (point: Point, target: Point): Costs => {

    const G = Math.sqrt( (point.col-origin.col)**2 + (point.row-origin.row)**2);
    const H = calculateH(point, target);
    const F = G + H;

    return { G, H, F};
  }

  const getCostByPoint = (point: Point): Costs => costs[point.row][point.col];

  const getBestPoint = (q: Point[]):Point => {
    let bestPoint = q[0];
    q.forEach(p => {
      if (getCostByPoint(p).F <= getCostByPoint(bestPoint).F) {
        bestPoint = p;
      }
    });
    return bestPoint;
  }


  costs[origin.row][origin.col] = calculateCost(origin, destination);

  while (q.length) {
    
    const currentPoint = getBestPoint(q);

    q = q.filter(p => p.row !== currentPoint.row && p.col !== currentPoint.col);

    if (isDestination(currentPoint)) {
      return [visitedTiles, []];
    }

    visitedTiles.push(currentPoint);

    const neighbors = getNeighbors(currentPoint);

    for (let neighbor of neighbors) {

      if (!isWall(grid, neighbor) && !isVisited(visitedTiles, neighbor) ) {
        if (!q.includes(neighbor)) {
          q.push(neighbor);
        }
        costs[neighbor.row][neighbor.col] = calculateCost(neighbor, destination);       
      }
    }
  }
  return [visitedTiles,[]];
};

export default AStar;
