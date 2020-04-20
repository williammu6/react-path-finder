import React, { useState, useEffect } from "react";

import Tile from "../Tile";

import { TileStatus } from "../../enums/TileStatus";

import "./styles.css";
import Header from "../Header";
import AStar from "../../utils/AStar";

interface Point {
  row: number;
  col: number;
}

const Grid: React.FC = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const createGrid = (width: number, height: number) => {
    let grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => TileStatus.NORMAL)
    );

    grid[0][0] = TileStatus.ORIGIN;
    grid[height - 1][width - 1] = TileStatus.DESTINATION;

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
    if (
      current_state !== TileStatus.ORIGIN &&
      current_state !== TileStatus.DESTINATION
    ) {
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
  };

  const onMouseEnterTile = (row: number, col: number) => {
    if (isClicked) {
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
  };

  const resetGrid = () => {
    setGrid(createGrid(45, 20));
  };

  const run = () => {
    AStar(grid);
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
