import React, { useState, useEffect } from "react";

import Tile from "../Tile";

import { TileStatus } from "../../enums/TileStatus";

import "./styles.css";
import Header from "../Header";
import AStar from "../../algorithms/AStar";
import Dijkstra from "../../algorithms/Dijkstra";
import { Point } from "../../interfaces/Point";

const Grid: React.FC = () => {
  const [origin, setOrigin] = useState<Point>({ row: 10, col: 5 });
  const [destination, setDestination] = useState<Point>({ row: 10, col: 40 });
  const [isDraggingOrigin, setIsDraggingOrigin] = useState<boolean>(false);
  const [isDraggingDestination, setIsDraggingDestination] = useState<boolean>(
    false
  );

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const createGrid = (width: number, height: number) => {
    let grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => TileStatus.NORMAL)
    );

    grid[origin.row][origin.col] = TileStatus.ORIGIN;
    grid[destination.row][destination.col] = TileStatus.DESTINATION;

    return grid;
  };

  const [grid, setGrid] = useState<TileStatus[][]>(createGrid(45, 20));

  const changeStateTile = (row: number, col: number, state: TileStatus) => {
    let tmpGrid = grid.slice();
    tmpGrid[row][col] = state;
    setGrid(tmpGrid);
  };

  const onMouseClickTile = (row: number, col: number) => {
    setIsClicked(true);
    const current_state = grid[row][col];
    if (current_state === TileStatus.ORIGIN) {
      setIsDraggingOrigin(true);
    } else if (current_state === TileStatus.DESTINATION) {
      setIsDraggingDestination(true);
    } else {
      changeStateTile(
        row,
        col,
        current_state === TileStatus.WALL ? TileStatus.NORMAL : TileStatus.WALL
      );
    }
  };
  const onMouseLeaveTile = (row: number, col: number) => {
    // console.log(`Left ${row}, ${col}`);
  };

  const onMouseUpTile = (row: number, col: number) => {
    setIsClicked(false);
    if (isDraggingDestination) setIsDraggingDestination(false);
    if (isDraggingOrigin) setIsDraggingOrigin(false);
  };

  const updateGridOrigin = (row: number, col: number) => {
    let gridTmp = grid;
    if (gridTmp[row][col] === TileStatus.DESTINATION) return;
    gridTmp[origin.row][origin.col] = TileStatus.NORMAL;
    gridTmp[row][col] = TileStatus.ORIGIN;
    setGrid(gridTmp);
    setOrigin({ row, col });
  };
  const updateGridDestination = (row: number, col: number) => {
    let gridTmp = grid;
    if (gridTmp[row][col] === TileStatus.ORIGIN) return;
    gridTmp[destination.row][destination.col] = TileStatus.NORMAL;
    gridTmp[row][col] = TileStatus.DESTINATION;
    setGrid(gridTmp);
    setDestination({ row, col });
  };

  const onMouseEnterTile = (row: number, col: number) => {
    if (isClicked) {
      if (isDraggingOrigin) {
        updateGridOrigin(row, col);
      } else if (isDraggingDestination) {
        updateGridDestination(row, col);
      } else {
        const current_state = grid[row][col];
        if (
          current_state !== TileStatus.ORIGIN &&
          current_state !== TileStatus.DESTINATION
        ) {
          changeStateTile(
            row,
            col,
            current_state === TileStatus.WALL
              ? TileStatus.NORMAL
              : TileStatus.WALL
          );
        }
      }
    }
  };

  const removePaths = () =>
    new Promise((resolve, _) => {
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          const current_state = grid[row][col];
          if (current_state === TileStatus.PATH) {
            const tile = document.getElementById(`tile-${row}-${col}`);
            if (tile) tile.className = "tile";
          }
        }
      }
      resolve(true);
    });

  const resetTileStates = () => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const current_state = grid[row][col];
        if (
          current_state === TileStatus.ORIGIN ||
          current_state === TileStatus.DESTINATION
        )
          continue;
        const tile = document.getElementById(`tile-${row}-${col}`);
        if (tile) tile.className = "tile";
      }
    }
  };

  const resetGrid = () => {
    setGrid(createGrid(45, 20));
    resetTileStates();
    setIsClicked(false);
  };

  const showPathAnimation = async (
    tiles: Point[],
    className: string,
    delay: number
  ) =>
    new Promise((resolve, reject) => {
      let gridTmp = grid.slice();
      for (let i = 0; i < tiles.length; i++) {
        const { row, col } = tiles[i];
        setTimeout(() => {
          const current_state = gridTmp[row][col];
          if (
            current_state !== TileStatus.NORMAL &&
            current_state !== TileStatus.PATH
          )
            return;
          gridTmp[row][col] = TileStatus.PATH;
          let tile = document.getElementById(`tile-${row}-${col}`);
          if (tile) tile.className = className;
          if (i >= tiles.length - 3) resolve(true);
        }, i * delay);
      }
    });

  const run = async (algorithm: Function) => {
    const [visitedTiles, pathTiles] = algorithm(grid, origin, destination);
    await removePaths();
    await showPathAnimation(visitedTiles, "tile path", 3);
    await showPathAnimation(pathTiles, "tile shortest-path", 20);
  };

  return (
    <div className="grid-container">
      <Header resetGrid={resetGrid} run={run} />
      <div className="grid">
        {grid.map((rows: number[], row: number) => {
          return (
            <div className="row" key={row}>
              {rows.map((tileState: TileStatus, col: number) => (
                <Tile
                  key={col}
                  row={row}
                  col={col}
                  state={tileState}
                  onMouseClick={(row, col) => onMouseClickTile(row, col)}
                  onMouseLeave={(row, col) => onMouseLeaveTile(row, col)}
                  onMouseEnter={(row, col) => onMouseEnterTile(row, col)}
                  onMouseUp={(row, col) => onMouseUpTile(row, col)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
