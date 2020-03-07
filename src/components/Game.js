import React, { Component } from "react";
import {
  numCols,
  numRows,
  CELL,
  startPos,
  bodyPos,
  KEYS,
  FOOD
} from "../config";
import "../styles/Game.css";
import Cells from "./Cells";
import EndGame from "./EndGame";

class Game extends Component {
  state = {
    snake: [],
    board: [],
    direction: null,
    speed: null,
    score: null,
    bestScore: null,
    gameOver: false
  };

  componentDidMount() {
    this.startGame();
  }

  startGame = () => {
    const board = [];
    const snake = [startPos];
    const speed = 150;

    board[startPos] = bodyPos;

    this.setState(
      {
        snake,
        board,
        speed,
        score: -1,
        bestScore: JSON.parse(localStorage.getItem("bestScore")) || 0,
        direction: KEYS.down
      },
      () => this.frame()
    );
  };

  restart = () => {
    this.setState({
      gameOver: false
    });
    this.startGame();
  };

  frame = () => {
    if (this.state.gameOver) return;

    const { snake, board } = this.state;
    let { speed, direction } = this.state;

    if (this.nextDirection) {
      direction = this.nextDirection;
      this.setState({
        direction: this.nextDirection
      });
      this.nextDirection = null;
    }

    const head = this.getNextIndex(snake[0], direction);

    const food = board[head] === FOOD || snake.length === 1;

    if (board[head] === 1) {
      this.setState({
        gameOver: true
      });
    }

    if (food) {
      const maxCells = numCols * numRows;
      speed = Math.floor(speed * 0.98);

      let i;

      this.setState(state => ({
        score: state.score + 1,
        bestScore:
          state.score >= state.bestScore ? state.score + 1 : state.bestScore
      }));

      localStorage.setItem("bestScore", JSON.stringify(this.state.bestScore));

      do {
        i = Math.floor(Math.random() * maxCells);
      } while (board[i]);

      board[i] = FOOD;
    } else board[snake.pop()] = null;

    snake.unshift(head);
    board[head] = bodyPos;

    this.setState(
      {
        board,
        snake,
        speed
      },
      () => {
        setTimeout(this.frame, speed);
      }
    );
  };

  getNextIndex = (head, direction) => {
    // translate index into x/y coords to make math easier
    var x = head % numCols;
    var y = Math.floor(head / numCols);

    // move forward one step in the correct direction, wrapping if needed
    switch (direction) {
      case KEYS.up:
        x = x <= 0 ? numCols - 1 : x - 1;
        break;
      case KEYS.down:
        x = x >= numCols - 1 ? 0 : x + 1;
        break;
      case KEYS.left:
        y = y <= 0 ? numRows - 1 : y - 1;
        break;
      case KEYS.right:
        y = y >= numRows - 1 ? 0 : y + 1;
        break;
      default:
        return;
    }

    // translate new x/y coords back into array index
    return numCols * y + x;
  };

  changeDirection = e => {
    e.preventDefault();
    const { direction } = this.state;

    if (direction === e.keyCode) return;
    if (
      e.keyCode === 37 ||
      e.keyCode === 38 ||
      e.keyCode === 39 ||
      e.keyCode === 40
    ) {
      if (Math.abs(direction - e.keyCode) === 2) return;

      this.nextDirection = e.keyCode;
    }
  };

  render() {
    const style = {
      width: numCols * CELL,
      height: numRows * CELL
    };

    return (
      <div className="wrapper">
        <div
          tabIndex={0}
          onKeyDown={this.changeDirection}
          className={this.state.gameOver ? "board end" : "board"}
          style={style}
        >
          <Cells board={this.state.board} />
          {this.state.gameOver ? <EndGame restart={this.restart} /> : null}
        </div>
        <div className="wrapper--score">
          <h1>Score: {this.state.score}</h1>
          <h3>Best score: {this.state.bestScore}</h3>
        </div>
      </div>
    );
  }
}

export default Game;
