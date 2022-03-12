import { MOVE } from './constants';

let initialX = null;
let initialY = null;

export const touchStart = (event) => {
    const { touches } = event;

    initialX = touches[0].clientX;
    initialY = touches[0].clientY;
};

export const touchMoveToGameMove = (event) => {
    if (initialX == null || initialY == null) return;

    const { touches } = event;
    const currentX = touches[0].clientX;
    const currentY = touches[0].clientY;

    const diffX = initialX - currentX;
    const diffY = initialY - currentY;
    const minMove = 50;

    if (Math.abs(diffX) < minMove && Math.abs(diffY) < minMove) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // horizontal
        if (diffX > 0) {
            return MOVE.left;
        } else {
            return MOVE.right;
        }
    } else {
        // vertical
        if (diffY > 0) {
            return MOVE.up;
        } else {
            return MOVE.down;
        }
    }

    initialX = null;
    initialY = null;
};
