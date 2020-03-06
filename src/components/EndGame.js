import React from "react";
import "../styles/EndGame.css";

const EndGame = props => {
  return (
    <div className="game--over">
      <button onClick={props.restart} className="game--over__btn">
        Start again
      </button>
    </div>
  );
};

export default EndGame;
