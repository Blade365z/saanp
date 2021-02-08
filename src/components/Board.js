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
            tail: [],
            score: 0,
            SnakeMoveInterval: 100,
            currentDirection: 'right'
        }
    }

    renderGrid = async () => {
        var grid = [];
        for (let row = 0; row < this.state.rows; row++) {
            for (let col = 0; col < this.state.cols; col++) {
                let isFood = false, isHead = false,isTail=false;
                if (row === this.state.food.row && col === this.state.food.col) {
                    isFood = true;
                }
                if (row === this.state.snake.row && col === this.state.snake.col) {
                    isHead = true;
                }
                this.state.tail.map(t=>{
                    if(row === t.row && col === t.col){
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
            snake: snakeHEADState
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
    tempFunctionJustToScrewYou = () => {
        let temp = this.state.snake;
        let tail = this.state.tail;
        this.setState({
            tail:[...this.state.tail,temp]
        })
        this.renderGrid();
    }
   
    updatePosition = () => {
        setInterval(() => {
            this.moveSnakeInDirection();
        }, 1000);

        setTimeout(() => {
            this.tempFunctionJustToScrewYou();
        }, 3000);
    }
    render() {
        const listOfGrids = this.state.grid.map(grid => {
            return <div key={grid.row.toString() + '-' + grid.col.toString()} className={
                grid.isFood ? 'food-item square' : grid.isHead ? 'snake-head square' : grid.isTail ? 'snake-tail square' : 'square'
            }></div>
        })
        return <div className="mainBoard">{listOfGrids}</div>
    }
}
export default Board;