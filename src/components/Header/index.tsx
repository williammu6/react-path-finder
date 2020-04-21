import React, { useState } from "react";

import "./styles.css";
import Button from "../../styled-components/Button";
import Select from "../../styled-components/Select";
import AStar from "../../algorithms/AStar";
import Dijkstra from "../../algorithms/Dijkstra";

interface Props {
  resetGrid(): void;
  run(algorithm: Function): void;
}

const Header: React.FC<Props> = (props) => {
  const { resetGrid, run } = props;

  const [index, setIndex] = useState<number>(0);

  const algorithms = [
    { value: 0, label: "A* algorithm", algorithm: AStar },
    { value: 1, label: "Dijkstra's algorithm", algorithm: Dijkstra },
  ];

  const onAlgorithmChange = (e: any) => {
    setIndex(e.target.value);
  };

  return (
    <div className="header-container">
      <Select id="algorithm" onChange={(e) => onAlgorithmChange(e)}>
        {algorithms.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </Select>
      <Button onClick={() => run(algorithms[index].algorithm)}>Run</Button>
      <Button onClick={() => resetGrid()}>Reset</Button>
    </div>
  );
};

export default Header;
