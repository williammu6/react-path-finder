import React from "react";

import "./styles.css";
import { TileStatus } from "../../enums/TileStatus";

interface Props {
  row: number;
  col: number;
  state: TileStatus;
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
      case TileStatus.NORMAL:
        return "";
      case TileStatus.WALL:
        return "wall";
      case TileStatus.ORIGIN:
        return "origin";
      case TileStatus.DESTINATION:
        return "destination";
      case TileStatus.PATH:
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
