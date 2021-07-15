import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, j) {
        //the i is the position of the board in the big board; the j is the position on the small board
        return (
            <Square
                value={this.props.squares[i][j]}
                onClick={() => this.props.onClick(i,j)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0,0)}
                    {this.renderSquare(0,1)}
                    {this.renderSquare(0,2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(0,3)}
                    {this.renderSquare(0,4)}
                    {this.renderSquare(0,5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(0,6)}
                    {this.renderSquare(0,7)}
                    {this.renderSquare(0,8)}
                </div>
                <div>
                    <div className="board-row">
                        {this.renderSquare(1,0)}
                        {this.renderSquare(1,1)}
                        {this.renderSquare(1,2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(1,3)}
                        {this.renderSquare(1,4)}
                        {this.renderSquare(1,5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(1,6)}
                        {this.renderSquare(1,7)}
                        {this.renderSquare(1,8)}
                    </div>
                </div>
                <div>
                    <div className="board-row">
                        {this.renderSquare(2,0)}
                        {this.renderSquare(2,1)}
                        {this.renderSquare(2,2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(2,3)}
                        {this.renderSquare(2,4)}
                        {this.renderSquare(2,5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(2,6)}
                        {this.renderSquare(2,7)}
                        {this.renderSquare(2,8)}
                    </div>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    // squares: Array(9)(9).fill(null)
                    //double array
                    squares: Array(9).fill(null).map(row => new Array(9).fill(null)),
                    result: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            //assume that X is the next player
            xIsNext: true
        };
    }


    handleClick(big, now) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const result = current.result.slice();

        //update the result table after the clicking, only the changed one needs to be update
        result[big] = calculatePartWinner(squares[big]);

        if (calculateWinner(result) || squares[big][now]) {
            return;
        }
        //set the clicked position
        squares[big][now] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    result:result
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.result);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(big, now) => this.handleClick(big, now)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//get the final winner
function calculateWinner(result) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (result[a] && result[a] === result[b] && result[a] === result[c]) {
            return result[a];
        }
    }
    return 0;
}

//get the part winner
function calculatePartWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

