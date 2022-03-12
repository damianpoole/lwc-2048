export const canMove = (cells) => {
    return cells.some((group) => {
        return group.some((cell, index) => {
            if (index == 0) return false;
            if (cell.tile == null) return false;
            const moveTo = group[index - 1];
            return moveTo.canAccept(cell.tile);
        });
    });
};

export const slide = (cells, board) => {
    return Promise.all(
        cells.flatMap((group) => {
            const promises = [];
            for (let i = 1; i < group.length; i++) {
                const cell = group[i];
                if (cell.tile == null) continue;
                let lastValidCell;
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j];
                    if (!moveToCell.canAccept(cell.tile)) break;

                    lastValidCell = moveToCell;
                }

                if (lastValidCell != null) {
                    promises.push(board.waitForTileTransition(cell.tile.key));
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        lastValidCell.tile = cell.tile;
                    }
                    cell.tile = null;
                }
            }

            // TODO: this needs to be moved
            board.tiles = [...board.tiles];

            return promises;
        })
    );
};
