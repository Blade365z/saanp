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
            snakeHead: getInitialLocationForSnake(20, 20),
            food: getRandomGrid(20, 20),
            snakeTail: [],
            score: 0,
            currentDirection: 'right',
            numberOfTails: 2,
            currentGameSate: 0,
            speed: 200
        }
    }
    // initialState = this.state;;
    renderGrid = async () => {
        var grid = [];
        for (let row = 0; row < this.state.rows; row++) {
            for (let col = 0; col < this.state.cols; col++) {
                let isFood = false,
                    isHead = false,
                    isTail = false;
                if (row === this.state.food.row && col === this.state.food.col) {
                    isFood = true;
                }
                if (row === this.state.snakeHead.row && col === this.state.snakeHead.col) {
                    isHead = true;
                }
                this.state.snakeTail.map(t => {
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
    moveSnakeInDirection = async () => {
        var snakeHEADState = this.state.snakeHead;
        let tail = this.state.snakeTail;
        let checking = await this.checkIfGameOverOREat();
        tail.unshift({
            row: snakeHEADState.row,
            col: snakeHEADState.col,
        })
        if (checking === -1) {
            this.gameOver();
            return 0;
        } else {
            if (checking === 1) {
                this.snakeEatsFood();
            }
            let direction = this.state.currentDirection;
            if (direction === 'right') {
                snakeHEADState.col++;
            } else if (direction === 'left') {
                snakeHEADState.col--;
            } else if (direction === 'up') {
                snakeHEADState.row--;
            } else if (direction === 'down') {
                snakeHEADState.row++;
            }
            this.setState({
                snakeHead: snakeHEADState,
                snakeTail: tail.slice(0, this.state.numberOfTails)
            });
            this.renderGrid();

        }

    }
    InitalizeSnakeOnBoard = () => {
        let rows = this.state.rows;
        let cols = this.state.cols;
        let newPos = getInitialLocationForSnake(rows, cols)
        this.setState({
            snakeHead: newPos
        })
        return newPos;
    }
    InitializeFoodOnBoard = () => {
        let rows = this.state.rows;
        let cols = this.state.cols;
        let newPos = getRandomGrid(rows, cols)
        let unique = false;
        while (unique === false) {
            this.state.snakeTail.map(pos => {
                if (newPos.row === pos.row && newPos.col === pos.col) {
                    newPos = getRandomGrid(rows, cols)
                    unique = false;
                }
                else {
                    unique = true;
                }
            })
            if (newPos.row === this.state.snakeHead.row && newPos.col === this.state.snakeHead.col) {
                newPos = getRandomGrid(rows, cols)
                unique = false;
            }
        }
        this.setState({
            food: newPos
        })
        return newPos;
    }
    componentDidMount = () => {
        document.body.addEventListener('keydown', this.handleKeyPress);
        this.renderGrid();


    }
    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (e,key=null) => {
        let currentDirection = null;
        let directionType = {
            'right': 'horizontal',
            'left': 'horizontal',
            'up': 'vertical',
            'down': 'vertical'
        };
        if(key==null){
            key = e.keyCode;
        }
        switch (key) {
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
        if (this.state.currentGameSate === 1) {
            if ((this.state.currentDirection !== currentDirection) && (directionType[this.state.currentDirection] !== directionType[currentDirection])) {
                this.setState({
                    currentDirection: currentDirection
                })
                this.moveSnakeInDirection(currentDirection)
            }
        }
    }
    checkIfGameOverOREat = async () => {
        const { row, col } = this.state.snakeHead;
        let outcome = 0;
        this.state.snakeTail.map(pos => {
            if (row === pos.row && col === pos.col) {
                outcome = -1;
            }
        })
        if (row === this.state.food.row && col === this.state.food.col) {
            outcome = 1;
        } else {
            if (row + 1 > this.state.rows || col + 1 > this.state.cols) {
                outcome = -1;
            }
            if (row < 0 || col < 0) {
                outcome = -1;
            }
        }
        return outcome;
    }
    snakeEatsFood = () => {
        this.InitializeFoodOnBoard();
        this.setState({
            numberOfTails: this.state.numberOfTails + 1,
            score: this.state.score + 10,
            speed: this.state.speed - 10
        });
        clearInterval(this.positionUpdater);
        this.updatePosition();
    }
    positionUpdater = null;
    gameOver = () => {
        this.setState({
            currentGameSate: -1
        })
        clearInterval(this.positionUpdater)
    }
    restartGame = () => {
        this.setState({
            grid: [],
            snakeHead: getInitialLocationForSnake(20, 20),
            food: getRandomGrid(20, 20),
            snakeTail: [],
            score: 0,
            currentDirection: 'right',
            numberOfTails: 2,
            currentGameSate: 0,
            speed: 200
        });
        this.startGame()
    }
    startGame = () => {
        this.setState({
            currentGameSate: 1
        })
        this.updatePosition();
    }
    updatePosition = () => {
        this.positionUpdater = setInterval(() => {
            this.moveSnakeInDirection();
        }, this.state.speed);
    }
    render() {
        const listOfGrids = this.state.grid.map(grid => {
            return <div key={grid.row.toString() + '-' + grid.col.toString()}
                className={
                    grid.isHead ?
                        'square snake-head' : grid.isTail ?
                            'square snake-tail' : grid.isFood ?
                                'square food-item' : 'square'

                } > </div>
        })
        return (<div>
             <div style={{ marginTop: '0px' }}>
                {this.state.currentGameSate === -1 && <div><h3 style={{ margin: '0px', color: 'red' }}>Game over!</h3></div>}
                <div><h5>Score: {this.state.score}</h5></div>
            </div>
            <div className="mainBoard" > {listOfGrids} </div>
            <div style={{ marginTop: '10px' }}>
                {this.state.currentGameSate === 0 && <button className="ui labeled icon  basic button" onClick={this.startGame}>
                    <i className="play icon"></i>
                        Play
                    </button>}
            </div>
            <div style={{ marginTop: '10px' }}>
                {this.state.currentGameSate === -1 && <button className="ui labeled icon  basic button" onClick={this.restartGame}>
                    <i className="redo icon"></i>
                        Replay
                    </button>}
            </div>
           
            {
                this.state.currentGameSate  ===1 && 
            <div className="controlBtns">
                <div>
                    <button class="ui basic button "  onClick={()=>{
                        this.handleKeyPress(null,38)
                    }} >
                        <i class="angle up icon horizontalBtns" ></i>
                    </button>
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <div className="LinearControlButtons">
                    <button class="ui basic button " onClick={()=>{
                        this.handleKeyPress(null,37)
                    }}  >
                        <i class="angle left icon horizontalBtns"></i>
                    </button>
                    </div>
                    <div className="LinearControlButtons">
                    <button class="ui basic button"  onClick={()=>{
                        this.handleKeyPress(null,39)
                    }} >
                        <i class="angle right icon " ></i>
                    </button>
                    </div>
                </div>
                <div>
                    <button class="ui basic button " onClick={()=>{
                        this.handleKeyPress(null,40)
                    }} >
                        <i class="angle down icon horizontalBtns"  ></i>
                    </button>
                </div>
            </div>
            }
             <div className="footer"> 
                    <small style={{margin:'0'}}>Made with <span style={{color:'red',fontSize:'0.8em',paddingTop:'10'}}> ❤ </span> by blade</small> 
                </div>
        </div>)
    }
}
export default Board;