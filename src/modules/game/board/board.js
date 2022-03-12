import { LightningElement } from 'lwc';
import Game from './game';
import { MOVE } from './constants';
import { touchMoveToGameMove, touchStart } from './touch';

export default class Board extends LightningElement {
    connectedCallback() {
        this.template.host.style.setProperty('--grid-size', Game.GRID_SIZE);
        this.template.host.style.setProperty(
            '--cell-size',
            `${Game.CELL_SIZE}vmin`
        );
        this.template.host.style.setProperty(
            '--cell-gap',
            `${Game.CELL_GAP}vmin`
        );

        const [cells, tiles] = Game.setupGame(this);
        this.cells = cells;
        this.tiles = tiles;

        this.keyboardInit();
        this.touchInit();
    }

    cells;
    tiles;

    acceptsInput = true;

    touchInit() {
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove);
    }

    keyboardInit() {
        window.addEventListener('keydown', this.handleInput);
    }

    handleTouchStart = (event) => {
        touchStart(event);
    };

    handleTouchMove = async (event) => {
        const move = touchMoveToGameMove(event);

        if (!this.acceptsInput) return;

        if (move) {
            this.acceptsInput = false;

            const [cells, tiles] = await Game.performMove(move);

            this.acceptsInput = true;

            if (cells) this.cells = [...cells];
            if (tiles) this.tiles = [...tiles];

            this.checkGameOver();
        }
    };

    handleInput = async (e) => {
        const { key } = e;

        if (!this.acceptsInput) return;

        const actions = {
            ['ArrowUp']: MOVE.up,
            ['ArrowDown']: MOVE.down,
            ['ArrowLeft']: MOVE.left,
            ['ArrowRight']: MOVE.right,
        };

        if (!actions[key]) return this.keyboardInit();

        this.acceptsInput = false;

        const [cells, tiles] = await Game.performMove(actions[key]);

        if (cells) this.cells = [...cells];
        if (tiles) this.tiles = [...tiles];

        this.acceptsInput = true;

        this.checkGameOver();
    };

    checkGameOver() {
        setTimeout(() => {
            if (Game.isGameOver()) {
                alert('Game Over');
            }
        });
    }

    waitForTileTransition(key, animation) {
        const tileElement = this.template.querySelector(`[data-tile="${key}"]`);

        return new Promise((resolve) => {
            const handler = () => {
                tileElement.removeEventListener(
                    animation ? 'animationend' : 'transitionend',
                    handler
                );
                resolve();
            };
            tileElement.addEventListener(
                animation ? 'animationend' : 'transitionend',
                handler
            );
        });
    }
}
