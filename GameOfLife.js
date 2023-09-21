// **************************************************************//
//              Marina Wahl - dev.mariwahl.us  - 2014            //
//                    GAME OF LIFE IN JAVASCRIPT                 //
//                                                               //
// Rules:                                                        //
//                                                               //
// 1. Start with a random configuration of dead or alive cells   //
// 2. Loneliness: any cell with less than 2 neighbors will die   //
// 3. Overcrowd: any cell with more than 3 neighbors will die    //
// 4. Optimized: any cell with 3 neighbors will grow             //
//                                                               //
// **************************************************************//

let gameInterval;
let gameRunning = false;

class GameOfLife {
    constructor() {
        this.TIME = 100;
        this.board_cells = [];
        this.cell_age = [];
        this.BOARD_WIDTH = 600;
        this.BOARD_HEIGHT = 300;
        this.SIZE_CELL = 1;
        this.CELL_COLOR = "#00FF00";
        this.AGED_CELL_COLOR = "#FF00FF";
        this.BACKGROUND_COLOR = "#000000";
        this.generation_counter = 0;
    }
    
    // Fills `board_cells` 2-D array where all elements (cells) are 0 (dead).
    destroyUniverse() {
        this.board_cells = Array.from({ length: this.BOARD_WIDTH + 1}, () => Array(this.BOARD_HEIGHT + 1).fill(0));
        this.cell_age = Array.from({ length: this.BOARD_WIDTH + 1}, () => Array(this.BOARD_HEIGHT + 1).fill(0));
    }

    // Generate the initial state of the binary-celled universe.
    createInitialGeneration() {
        this.destroyUniverse();
        for (let i = 1; i < this.BOARD_WIDTH; i++) {
            for (let j = 1; j < this.BOARD_HEIGHT; j++) {
                const alive_or_dead = Math.floor(Math.random() * 2);
                this.board_cells[i][j] = alive_or_dead;
            }
        }
    }

    // Generate the next state of the binary-celled universe.
    createNextGeneration() {
        const this_generation_cells = [];
        let aliveCount = 0;
        for (let i = 1; i < this.BOARD_WIDTH; i++) {
            this_generation_cells[i] = [];
            for (let j = 1; j < this.BOARD_HEIGHT; j++) {
                let count = 0;
                for (let x = i - 1; x <= i + 1; x++) {
                    for (let y = j - 1; y <= j + 1; y++) {
                        if (x === i && y === j) continue;
                        count += this.board_cells[x]?.[y] || 0;
                    }
                }
                this_generation_cells[i][j] = (count === 2) ? this.board_cells[i][j] : (count === 3 ? 1 : 0);

                if (this_generation_cells[i][j] === 1) {
                    this.cell_age[i][j]++;
                } else {
                    this.cell_age[i][j] = 0;
                }
            }
        }

        for (let i = 1; i < this.BOARD_WIDTH; i++) {
            for (let j = 1; j < this.BOARD_HEIGHT; j++) {
                if (this_generation_cells[i][j] === 1) {
                    aliveCount++;
                }
            }
        }

        const totalCells = this.BOARD_WIDTH * this.BOARD_HEIGHT;
        const alivePercent = aliveCount / totalCells;
        this.TIME = 10000 / (1 + Math.exp(-10 * (alivePercent - 0.7)))
        const roundedTime = this.TIME.toFixed(2);

        this.board_cells = this_generation_cells;
        this.generation_counter++;

        document.getElementById("generation-counter").innerText = `Generation: ${this.generation_counter}`;
        document.getElementById("time").innerText = `Time Between Generations: ${roundedTime}ms`;

        return this_generation_cells;
    }

    // Renders the visuals of the current generation.
    renderUniverse(this_generation_cells, context) {
        for (let i = 1; i < this.BOARD_WIDTH; i++) {
            for (let j = 1; j < this.BOARD_HEIGHT; j++) {
                const shift_i = i * this.SIZE_CELL;
                const shift_j = j * this.SIZE_CELL;
                
                let cellColor = this_generation_cells[i][j] ? 
                                (this.cell_age[i][j] > 100 ? this.AGED_CELL_COLOR : this.CELL_COLOR) : 
                                this.BACKGROUND_COLOR;

                context.fillStyle = cellColor;
                context.fillRect(shift_i, shift_j, this.SIZE_CELL, this.SIZE_CELL);
            }
        }
    }   
}

// Function to start the infinite game loop.
const startGame = () => {
    const game_canvas = document.getElementById("game");
    const context = game_canvas.getContext('2d');
    const newGame = new GameOfLife();
    newGame.createInitialGeneration();
    gameRunning = true;

    const gameLoop = () => {
        if (!gameRunning) return;
        const this_generation_cells = newGame.createNextGeneration();
        newGame.renderUniverse(this_generation_cells, context);
        setTimeout(gameLoop, newGame.TIME);
    };

    gameLoop();
};

// Function to stop and reset the game.
const stopGame = () => {
    gameRunning = false;
    const game_canvas = document.getElementById("game");
    const context = game_canvas.getContext('2d');
    const newGame = new GameOfLife();
    newGame.destroyUniverse();
    newGame.renderUniverse(newGame.board_cells, context);
    document.getElementById("generation-counter").innerText = "Generation: 0";
    document.getElementById("time").innerText = "Time Between Generations: 0";
};