import React, { Component } from 'react'
import './saanp.css';

class Board extends Component {
    food = this.getRandomGrid();
    snakePos = { row: 0, col: 0 }
    tail = []
    state = {
        rows: 10,
        cols: 10,
        grid: this.makeGrids(),
        currentDirection: 'right',
        lengthOfSnake: 3,
        currentSnakePost: {},
        tail: [],
        food: {}
    };

    makeGrids() {
        const {
            rows,
            cols,
            food,
            snake
          } = state;
      
        var grid = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const isFood = (food.row === row && food.col === col);
                const isHead = (snake.head.row === row && snake.head.col === col);
                let isTail = false;
                this.tail.forEach(t => {
                    if (t.row === i && t.col === j) {
                        isTail = true
                    }
                })
                grid.push({
                    row: i,
                    col: j,
                    isTail,
                    isFood,
                    isHead
                })
            }
        }
        return grid;
    }
 


    componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyPress);
        this.setState({
            food: this.food,
            currentSnakePost: this.snakePos
        })
        this.change();
    }
    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyPress);

    }

    makeSnakeMove(direction) {
        if (direction == 'right') {
            this.snakePos.col++;
            this.setState({
                currentSnakePost: this.snakePos
            })
        } else if (direction == 'left') {
            this.snakePos.col--;
            this.setState({
                currentSnakePost: this.snakePos
            })
        }
        else if (direction == 'up') {
            this.snakePos.row = this.snakePos.row - 1;
            this.setState({
                currentSnakePost: this.snakePos
            })
        } else if (direction == 'down') {
            this.snakePos.row = this.snakePos.row + 1;
            this.setState({
                currentSnakePost: this.snakePos
            })
        }
    }
    handleKeyPress = (e) => {
        let currentDirection = null;
        switch (e.keyCode) {
            case 37:
                currentDirection = 'left';
                break;

            case 38:
                currentDirection = 'up';
                break;

            case 39:
            default:
                currentDirection = 'right';
                break;

            case 40:
                currentDirection = 'down';
                break;
        }
        this.setState({
            currentDirection: currentDirection
        })
        this.makeSnakeMove(currentDirection)
    }
    change() {
        setInterval(() => {
            this.makeSnakeMove(this.state.currentDirection);
        }, 300);
    }

    getRandomGrid() {
        let row = Math.floor((Math.random() * this.state.rows));
        let col = Math.floor((Math.random() * this.state.cols))
        this.setState({
            food: {
                row: row,
                col: col
            }
        })
        return {
            row: this.state.currentSnakePost.row === row ? row + 5 : row,
            col: this.state.currentSnakePost.row === row ? col + 7 : col
        }

    }
    render() {
        const listOfGrids = this.state.grid.map(grid => {
            return <div
                key={grid.row.toString() + '-' + grid.col.toString()}
                className={
                    grid.isHead
                    ? 'square snake-head' : grid.isTail
                    ? 'square is-tail' : grid.isFood
                    ? 'square food-item' : 'square'
                    }></div>
        })
        return (
            <div className="mainBoard">
                {listOfGrids}
            </div>
        )
    }
}


export default Board;