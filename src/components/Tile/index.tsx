import React from "react";

import "./styles.css";
import { TileState } from "../../enums/TileState";

interface Props {
  row: number;
  col: number;
  state: TileState;
  onMouseClick(row: number, col: number): void;
  onMouseEnter(row: number, col: number): void;
  onMouseLeave(row: number, col: number): void;
  onMouseUp(row: number, col: number): void;
}

const Tile: React.FC<Props> = (props) => {
  const {
    row,
    col,
    state,
    onMouseClick,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = props;

  const tileClass = () => {
    switch (+state) {
      case TileState.NORMAL:
        return "";
      case TileState.WALL:
        return "wall";
      case TileState.ORIGIN:
        return "origin";
      case TileState.DESTINATION:
        return "destination";
      case TileState.PATH:
        return "path";
      default:
        return "";
    }
  };

  return (
    <div
      id={`tile-${row}-${col}`}
      className={`tile ${tileClass()}`}
      onMouseDown={() => onMouseClick(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    ></div>
  );
};

export default Tile;
