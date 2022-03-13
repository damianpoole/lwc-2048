import Cell from './cell';
import { canMove, slide } from './movement';
import { MOVE } from './constants';

const GRID_SIZE = 4;
const CELL_SIZE = 15;
const CELL_GAP = 2;

let CELLS;
let BOARD;
let TILES;

let tileKey = 0;
const getTileKey = () => {
    tileKey++;
    return tileKey;
};

const setupCells = () => {
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (v, i) => {
        return new Cell(i % GRID_SIZE, Math.floor(i / GRID_SIZE), i);
    });

    CELLS = cells;

    return CELLS;
};

const setupTiles = () => {
    TILES = [createNewTile(), createNewTile()];
    return TILES;
};

const randomEmptyCell = () => {
    const randomIndex = Math.floor(Math.random() * emptyCells().length);
    return emptyCells()[randomIndex];
};

const createNewTile = () => {
    const emptyCell = randomEmptyCell();
    const tile = {
        x: emptyCell.x,
        y: emptyCell.y,
        key: getTileKey(),
        value: Math.random() > 0.5 ? 2 : 4,
    };
    emptyCell.tile = tile;

    return tile;
};

const emptyCells = () => {
    return CELLS.filter((cell) => cell.tile == null);
};

const cellsByColumn = () => {
    return CELLS.reduce((grid, cell) => {
        grid[cell.x] = grid[cell.x] || [];
        grid[cell.x][cell.y] = cell;

        return grid;
    }, []);
};

const cellsByRow = () => {
    return CELLS.reduce((grid, cell) => {
        grid[cell.y] = grid[cell.y] || [];
        grid[cell.y][cell.x] = cell;

        return grid;
    }, []);
};

const moveUp = () => {
    return slide(cellsByColumn(), BOARD);
};

const moveDown = () => {
    return slide(
        cellsByColumn().map((column) => [...column].reverse()),
        BOARD
    );
};

const moveLeft = () => {
    return slide(cellsByRow(), BOARD);
};

const moveRight = () => {
    return slide(
        cellsByRow().map((row) => [...row].reverse()),
        BOARD
    );
};

const canMoveUp = () => {
    return canMove(cellsByColumn());
};

const canMoveDown = () => {
    return canMove(cellsByColumn().map((column) => [...column].reverse()));
};

const canMoveLeft = () => {
    return canMove(cellsByRow());
};

const canMoveRight = () => {
    return canMove(cellsByRow().map((row) => [...row].reverse()));
};

const performMove = async (move) => {
    const actions = {
        [MOVE.up]: {
            action: moveUp,
            test: canMoveUp,
        },
        [MOVE.down]: {
            action: moveDown,
            test: canMoveDown,
        },
        [MOVE.left]: {
            action: moveLeft,
            test: canMoveLeft,
        },
        [MOVE.right]: {
            action: moveRight,
            test: canMoveRight,
        },
    };

    if (actions[move]) {
        if (!actions[move].test.call()) {
            return [];
        }
        await actions[move].action.call();
    }

    let score = 0;

    CELLS.forEach((cell) => {
        const [mergedKey, mergeValue] = cell.mergeTiles();
        TILES = TILES.filter((tile) => tile.key != mergedKey);
        if (mergeValue) score = score + mergeValue;
    });

    const newTile = createNewTile();
    TILES.push(newTile);

    return [CELLS, TILES, score];
};

const setupGame = (board) => {
    BOARD = board;

    return [setupCells(), setupTiles()];
};

const isGameOver = () => {
    return !canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight();
};

const GAME = {
    GRID_SIZE,
    CELL_SIZE,
    CELL_GAP,

    setupGame,
    cellsByColumn,
    cellsByRow,
    emptyCells,
    createNewTile,
    performMove,
    isGameOver,
};

export default GAME;
