export default class Cell {
    x;
    y;
    key;

    constructor(x, y, key) {
        this.x = x;
        this.y = y;
        this.key = key;
    }

    get mergeTile() {
        return this._mergeTile;
    }
    set mergeTile(value) {
        this._mergeTile = value;
        if (value == null) return;
        this.mergeTile.x = this.x;
        this.mergeTile.y = this.y;
    }
    get tile() {
        return this._tile;
    }
    set tile(value) {
        this._tile = value;
        if (value == null) return;
        this.tile.x = this.x;
        this.tile.y = this.y;
    }

    canAccept(tile) {
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;

        this.tile.value = this.tile.value + this.mergeTile.value;
        const key = this.mergeTile.key;
        this.mergeTile = null;

        return key;
    }
}
