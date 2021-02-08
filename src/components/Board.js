import React, { Component } from 'react'
import { getInitialLocationForSnake, getRandomGrid } from './helper';
import './saanp.css';

class Board extends Component {
    constructor() {
        super();
        this.state = {
            rows: 20,
            cols: 20,
            grid: [],
            snake: {
                row: 0,
                col: 0
            },
            food: {
            },
            tail: [
            ],
            score: 0,
            SnakeMoveInterval: 100,
            currentDirection: 'right',
            numberOfTails: 5
        }
    }

    renderGrid = async () => {
        var grid = [];
        for (let row = 0; row < this.state.rows; row++) {
            for (let col = 0; col < this.state.cols; col++) {
                let isFood = false, isHead = false, isTail = false;
                if (row === this.state.food.row && col === this.state.food.col) {
                    isFood = true;
                }
                if (row === this.state.snake.row && col === this.state.snake.col) {
                    isHead = true;
                }
                this.state.tail.map(t => {
                    if (row === t.row && col === t.col) {
                        isTail = true;
                    }
                })
                grid.push({
                    row,
                    col,
                    isFood,
                    isHead,
                    isTail
                })
            }
        }
        this.setState({
            grid: grid
        })
    }
    moveSnakeInDirection = () => {
        var snakeHEADState = this.state.snake;
        let tail = this.state.tail;
        tail.unshift({
            row: snakeHEADState.row,
            col: snakeHEADState.col,
        })
        let direction = this.state.currentDirection;
        if (direction === 'right') {
            snakeHEADState.col++;
        }
        else if (direction === 'left') {
            snakeHEADState.col--;
        }
        else if (direction === 'up') {
            snakeHEADState.row--;
        }
        else if (direction === 'down') {
            snakeHEADState.row++;
        }
        this.setState({
            snake: snakeHEADState,
            tail: tail.slice(0, this.state.numberOfTails)
        });
        this.renderGrid();
    }
    updateSnakePosition = (i = null, j = null) => {
        let rows = this.state.rows;
        let cols = this.state.cols;
        let newPos = getInitialLocationForSnake(rows, cols)
        if (i !== null && j !== null) {
            newPos.row = i;
            newPos.col = j;
        }
        this.setState({
            snake: newPos
        })

        return newPos;
    }
    updateFoodPosition = () => {
        let rows = this.state.rows;
        let cols = this.state.cols;
        let newPos = getRandomGrid(rows, cols)
        this.setState({
            food: newPos
        })
        return newPos;
    }
    componentDidMount = async () => {
        await this.updateFoodPosition();
        await this.updateSnakePosition();
        document.body.addEventListener('keydown', this.handleKeyPress);
        this.renderGrid();
        this.updatePosition();
        // this.tempFunctionJustToScrewYou();
    }
    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyPress);
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
        if (this.state.currentDirection !== currentDirection) {
            this.setState({
                currentDirection: currentDirection
            })
            this.moveSnakeInDirection(currentDirection)
        }
    }

    shiftTail = (headPosition) => {
        var arr = [];
        for (let i = 0; i < this.state.numberOfTails; i++) {
            if (i == 0) {
                arr.push(headPosition)
            } else {


            }
        }
        this.setState({
            tail: arr
        })
        this.renderGrid();
    }

    updatePosition = () => {
        setInterval(() => {

            this.moveSnakeInDirection();
        }, 300);
    }
    render() {
        const listOfGrids = this.state.grid.map(grid => {
            return <div key={grid.row.toString() + '-' + grid.col.toString()} className={
                grid.isHead
                    ? 'square snake-head' : grid.isTail
                        ? 'square snake-tail' : grid.isFood
                            ? 'square food-item' : 'square'

            }></div>
        })
        return <div className="mainBoard">{listOfGrids}</div>
    }
}
export default Board;