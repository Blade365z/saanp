export const getRandomGrid = (numOfRows, numOfCols) => {
    let row = Math.floor((Math.random() * numOfRows));
    let col = Math.floor((Math.random() * numOfCols))
    return {
        row: row,
        col: col
    }

}


export const getInitialLocationForSnake = (numOfRows, numOfCols) => {
    let row = Math.floor(numOfRows / 2);
    let col = Math.floor(numOfCols / 2);
    return {
        row: row,
        col: col
    }

}