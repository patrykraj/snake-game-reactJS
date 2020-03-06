import React from "react";
import { numCols, numRows, bodyPos, FOOD } from "../config";
import "../styles/Cells.css";

const Cells = ({ board }) => {
  const cells = [];

  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      var code = board[numCols * row + col];
      var type = code === bodyPos ? "snake" : code === FOOD ? "food" : "null";

      cells.push(
        <div
          key={`${row}, ${col}`}
          data-pos={`${row}, ${col}`}
          className={`${type}-cell`}
        ></div>
      );
    }
  }

  return cells;
};

export default Cells;
