import React, { useState, useEffect } from "react";

import Tile from "../Tile";


import Header from "../Header";

import "./styles.css";

import AStar from "../../algorithms/AStar";
import Dijkstra from "../../algorithms/Dijkstra";

import { TileState } from "../../enums/TileState";
import { Point } from "../../interfaces/Point";
import {Algorithm} from "../../interfaces/Algorithm";

const Grid: React.FC = () => {
  const width = 45;
  const height = 20;

  const [origin, setOrigin] = useState<Point>({ row: 10, col: 5 });
  const [destination, setDestination] = useState<Point>({ row: 10, col: 40 });
  const [stateTileClicked, setStateTileClicked] = useState<TileState>();
  const [isDraggingOrigin, setIsDraggingOrigin] = useState<boolean>(false);
  const [isDraggingDestination, setIsDraggingDestination] = useState<boolean>(
    false
  );

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const algorithms: Algorithm[] = [
    { value: 0, label: "A* algorithm", algorithm: AStar },
    { value: 1, label: "Dijkstra's algorithm", algorithm: Dijkstra }
  ];

  const createGrid = (width: number, height: number) => {
    let grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => TileState.NORMAL)
    );

    grid[origin.row][origin.col] = TileState.ORIGIN;
    grid[destination.row][destination.col] = TileState.DESTINATION;

    return grid;
  };

  const [grid, setGrid] = useState<TileState[][]>(createGrid(width, height));

  const changeStateTile = (row: number, col: number, state: TileState) => {
    let tmpGrid = grid.slice();
    tmpGrid[row][col] = state;
    setGrid(tmpGrid);
  };

  const onMouseClickTile = (row: number, col: number) => {
    setIsClicked(true);
    const current_state = grid[row][col];
    setStateTileClicked(current_state);
    if (current_state === TileState.ORIGIN) {
      setIsDraggingOrigin(true);
    } else if (current_state === TileState.DESTINATION) {
      setIsDraggingDestination(true);
    } else {
      changeStateTile(
        row,
        col,
        current_state === TileState.WALL ? TileState.NORMAL : TileState.WALL
      );
    }
  };
  const onMouseLeaveTile = (row: number, col: number) => {
  };

  const onMouseUpTile = (row: number, col: number) => {
    setIsClicked(false);
    if (isDraggingDestination) setIsDraggingDestination(false);
    if (isDraggingOrigin) setIsDraggingOrigin(false);
  };

  const updateGridOrigin = (row: number, col: number) => {
    let gridTmp = grid;
    if (gridTmp[row][col] === TileState.DESTINATION) return;
    gridTmp[origin.row][origin.col] = TileState.NORMAL;
    gridTmp[row][col] = TileState.ORIGIN;
    setGrid(gridTmp);
    setOrigin({ row, col });
  };
  const updateGridDestination = (row: number, col: number) => {
    let gridTmp = grid;
    if (gridTmp[row][col] === TileState.ORIGIN) return;
    gridTmp[destination.row][destination.col] = TileState.NORMAL;
    gridTmp[row][col] = TileState.DESTINATION;
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
          current_state !== TileState.ORIGIN &&
          current_state !== TileState.DESTINATION
        ) {
          if (current_state !== stateTileClicked &&
              stateTileClicked !== TileState.PATH &&
              current_state !== TileState.PATH) return;
          changeStateTile(
            row,
            col,
            current_state === TileState.WALL
              ? TileState.NORMAL
              : TileState.WALL
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
          if (current_state === TileState.PATH) {
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
          current_state === TileState.ORIGIN ||
          current_state === TileState.DESTINATION
        )
          continue;
        const tile = document.getElementById(`tile-${row}-${col}`);
        if (tile) tile.className = "tile";
      }
    }
  };

  const resetGrid = () => {
    setGrid(createGrid(width, height));
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
            current_state !== TileState.NORMAL &&
            current_state !== TileState.PATH
          )
            return;
          gridTmp[row][col] = TileState.PATH;
          let tile = document.getElementById(`tile-${row}-${col}`);
          if (tile) tile.className = className;
          if (i >= tiles.length - 3) resolve(true);
        }, i * delay);
      }
    });

  const run = async (index: number) => {
    const algorithm = algorithms[index].algorithm;
    const [visitedTiles, pathTiles] = algorithm(grid, origin, destination);
    await removePaths();
    await showPathAnimation(visitedTiles, "tile path", 3);
    await showPathAnimation(pathTiles, "tile shortest-path", 20);
  };

  return (
    <div className="grid-container">
      <Header resetGrid={resetGrid} run={run} algorithms={algorithms} />
      <div className="grid">
        {grid.map((rows: number[], row: number) => {
          return (
            <div className="row" key={row}>
              {rows.map((tileState: TileState, col: number) => (
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
