import React, { useState } from "react";

import "./styles.css";
import Button from "../../styled-components/Button";
import Select from "../../styled-components/Select";
import {Algorithm} from "../../interfaces/Algorithm";

interface Props {
  resetGrid(): void;
  algorithms: Algorithm[];
  run(index: number): void;
}

const Header: React.FC<Props> = (props) => {
  const { resetGrid, run, algorithms } = props;

  const [index, setIndex] = useState<number>(0);

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
      <Button onClick={() => run(index)}>Run</Button>
      <Button onClick={() => resetGrid()}>Reset</Button>
    </div>
  );
};

export default Header;
