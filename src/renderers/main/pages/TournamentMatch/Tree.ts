import '@libs/konva.min.js';
import IKonva from 'konva';

const Konva = window.Konva;

class Tree {
    private _stage: IKonva.Stage;
    private _layer: IKonva.Layer;

    constructor() {
        this._stage = null;
    }

    initialize(width: number, height: number, id: string) {
        this._stage = new Konva.Stage({
            width,
            height,
            container: id
        })
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);
    }
}

export default new Tree();