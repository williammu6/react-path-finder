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

  const tileStyle = () => {
    switch (+state) {
      case TileStatus.NORMAL:
        return;
      case TileStatus.WALL:
        return { background: "#333" };
      case TileStatus.ORIGIN:
        return { background: "#0F0" };
      case TileStatus.DESTINATION:
        return { background: "#00F" };
      default:
        return;
    }
  };

  return (
    <div
      className="tile"
      style={tileStyle()}
      onMouseDown={() => onMouseClick(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    ></div>
  );
};

export default Tile;
