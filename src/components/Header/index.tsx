import React from "react";

import "./styles.css";
import Button from "../../StyledComponents";

interface Props {
  resetGrid(): void;
  run(): void;
}

const Header: React.FC<Props> = (props) => {
  const { resetGrid, run } = props;
  return (
    <div className="header-container">
      <Button onClick={() => run()}>Run</Button>
      <Button onClick={() => resetGrid()}>Reset</Button>
    </div>
  );
};

export default Header;
