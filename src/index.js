/* eslint-disable react/style-prop-object */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

  
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    )
  }

  render() {
    let n = 0
    let squareArr = []
    for (let x = 0; x < 3; x++) {
      let row = []
      for (let y = 0; y < 3; y++) {
        row.push(this.renderSquare(n))
        n++
      }
      squareArr.push(row)
    }
    return (
      <div>
        {squareArr.map((item, index) => {
          return (
            <div key={index}>
              {item}
            </div>
          )
        })}
      </div>
    );
  }
}
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          step: {x: Number, y: Number}
        }],
        stepNumber: 0,
        xIsNext: true,
        isAsend: true
      }
    }

    render() {
      const history = this.state.history
      const current = history[this.state.stepNumber]
      const winner = calculateWinner(current.squares)

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start'
        const cor = move ?
          `(${step.step.x}, ${step.step.y})` :
          ''
        const fontStyle = move === this.state.stepNumber ? "bold" : "normal"
        
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style={{fontWeight: fontStyle}} >{desc}</button>
            <label style={{marginLeft: 10}}>{cor}</label>
          </li>
        )
      })

      const reverseMoves = history.map((step, move) => {
        const desc = history.length - move !== 1 ?
          'Go to move #' + (history.length - move - 1) :
          'Go to game start'
        const cor = history.length - move !== 1 ?
          `(${step.step.x}, ${step.step.y})` :
          ''
        const fontStyle = move === this.state.stepNumber ? "bold" : "normal"
        
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style={{fontWeight: fontStyle}} >{desc}</button>
            <label style={{marginLeft: 10}}>{cor}</label>
          </li>
        )
      })
      

      let status
      if (winner) {
        status = 'Winner' + winner
      } else {
        status = 'Next player' + (this.state.xIsNext ? 'X' : 'O')
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>
              {status}
              <button style={{marginLeft: 20}} onClick={() => this.changeOrder()}>{this.state.isAsend ? "升序": "降序"}</button>
            </div>
            <ol>{ this.state.isAsend ? moves : reverseMoves}</ol>
          </div>
        </div>
      );
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber+1)
      const current = history[history.length - 1]
      const squares = current.squares.slice()
      if (calculateWinner(squares) || squares[i] || !this.state.isAsend) {
        return
      }
      let step = { x: parseInt(i/3), y: i%3 }
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({ 
        history: history.concat([{
          squares: squares,
          step: step
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext 
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      })
    }

    changeOrder() {
      const current = this.state.history.slice()
      this.setState({ history: current.reverse(), isAsend: !this.state.isAsend })
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  