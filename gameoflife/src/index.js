import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ButtonToolbar, Dropdown, DropdownButton } from "react-bootstrap";

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const width = this.props.cols * 14;
    var rowsArr = [];
    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.rows; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          //pushing a bunch of ox into the array
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      //calling the array of boxes down here {rowsArr}
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Buttons extends React.Component {
  handleSelect = (evt) => {
    this.props.gridSize(evt);
  };

  render() {
    return (
      <div>
        <h2 class="flux">The Game of Life </h2>
        <div className="wrap-content">
          <div className="history">
            <h3>I little bit of the history... </h3>

            <p>
              The Game of Life, also known simply as Life, is a cellular
              automaton devised by the British mathematician John Horton Conway
              in 1970. It is a zero-player game, meaning that its evolution is
              determined by its initial state, requiring no further input. One
              interacts with the Game of Life by creating an initial
              configuration and observing how it evolves.
            </p>
          </div>
          <div className="rules">
            <h3>Rules </h3>

            <p>
              1. Any live cell with fewer than two live neighbours dies, as if
              by underpopulation.
              <br />
              2. Any live cell with two or three live neighbours lives on to the
              next generation.
              <br />
              3. Any live cell with more than three live neighbours dies, as if
              by overpopulation.
              <br />
              4. Any dead cell with exactly three live neighbours becomes a live
              cell, as if by reproduction.
            </p>
          </div>
        </div>
        <div className="center">
          <ButtonToolbar>
            <button className="btn" onClick={this.props.playButton}>
              Play
            </button>
            <button className="btn" onClick={this.props.pauseButton}>
              Pause
            </button>
            <button className="btn" onClick={this.props.clear}>
              Clear
            </button>
            <button className="btn" onClick={this.props.slow}>
              Slow
            </button>
            <button className="btn" onClick={this.props.fast}>
              Fast
            </button>
            <button className="btn" onClick={this.props.seed}>
              Radom
            </button>
          </ButtonToolbar>
          <DropdownButton
            title="Grid Size"
            id="size-menu"
            onSelect={this.handleSelect}
          >
            <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
            <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
            <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;
    this.state = {
      generation: 0,
      //array big as rows variable and fill that with map. cretae another array and each element in that array is false. start grid cell turn off
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
    };
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  };

  radom = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
    });
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  fast = () => {
    this.speed = 100;
    this.playButton();
  };

  clear = () => {
    var grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0,
    });
  };

  gridSize = (size) => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
        break;
      case "2":
        this.cols = 50;
        this.rows = 30;
        break;
      default:
        this.cols = 70;
        this.rows = 50;
    }
    this.clear();
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && j < this.cols - 1)
          if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1,
    });
  };

  componentDidMount() {
    this.radom();
    this.playButton();
  }
  render() {
    return (
      /* passing variables as props to Grid component */
      <div>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.radom}
          gridSize={this.gridSize}
        />

        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}
ReactDOM.render(<Main />, document.getElementById("root"));
