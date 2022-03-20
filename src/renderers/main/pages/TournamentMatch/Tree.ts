import { nodeHeight, nodeWidth, playOffNodeHeight, playOffNodeWidth } from "@utils/constants";

class TournamentBracket {
    private _canvas: HTMLCanvasElement;
    private _treeLeft: Tree;
    private _treeRight: Tree;

    constructor() {
        this._canvas = null;
    }

    initialize(width: number, height: number, container: string) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = width;
        this._canvas.height = height;

        if (!document.getElementById(container).querySelector('canvas')) {
            document.getElementById(container).appendChild(this._canvas);
        }
    }

    get leftTree() {
        return this._treeLeft;
    }

    get rightTree() {
        return this._treeRight;
    }

    setTreeLeft(tree: Tree) {
        this._treeLeft = tree;
    }

    setTreeRight(tree: Tree) {
        this._treeRight = tree;
    }

    get canvas() {
        return this._canvas;
    }
}

export class Tree {
    private _direction: 'toRight' | 'toLeft';
    private _canvas: HTMLCanvasElement;
    private _levels: Map<number, Node>[];
    private _playoff: Map<number, {
        athlete01: Node;
        athlete02: Node;
    }>
    private _position: { x: number; y: number };
    private _size: { width: number; height: number };
    private _from: number;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        direction: 'toRight' | 'toLeft',
        canvas: HTMLCanvasElement
    ) {
        this._position = { x, y };
        this._size = { width, height };
        this._direction = direction;
        this._canvas = canvas;
        this._levels = [];
        this._playoff = new Map;
        this._from = 1;
    }

    getTotalPlayoffs() {
        return this._playoff.size;
    }

    getNode(key: number) {
        return this._levels[0].get(key);
    }

    getPlayOff(key: number) {
        return this._playoff.get(key);
    }

    generateBallots() {
        const a: number[] = [];
        this._levels[0].forEach((_, key) => {
            a.push(key);
        });
        return a;
    }

    createLevels(entries: number) {
        let level = 0;
        for (let i = entries; i >= 1; i /= 2) {
            const arr = new Array(Math.floor(i)).fill(0);
            const nodes = new Map();
            arr.map((_, index) => {
                const newNode = new Node(0, 0, nodeWidth, nodeHeight);
                if (level > 0) {
                    const added = index + 1;
                    this._levels[level - 1].get(index + added).converge(newNode);
                    this._levels[level - 1].get(index + added + 1).converge(newNode);
                }
                nodes.set(index + 1, newNode);
            });
            this._levels.push(nodes);
            level += 1;
        }
    }

    createPlayOff(total: number) {
        let count = 0;
        this._levels[0].forEach((node, to) => {
            if (count < total) {
                const athlete01 = new Node(0, 0, playOffNodeWidth, playOffNodeHeight);
                const athlete02 = new Node(0, 0, playOffNodeWidth, playOffNodeHeight);
                athlete01.converge(node);
                athlete02.converge(node);
                this._playoff.set(to, {
                    athlete01,
                    athlete02
                });
            }
            count++;
        });
    }

    render() {
        this.distributeVertical();
        this.distributeHorizontal();
        if (this._playoff.size > 0) {
            this.distributePlayOffs();
        }

        if (this._direction === 'toLeft') {
            this._canvas.getContext('2d').translate(this._position.x + this._size.width, 0);
            this._canvas.getContext('2d').scale(-1, 1);
        } else {
            this._canvas.getContext('2d').translate(this._position.x, 0);
        }

        this._levels.map((nodes, index) => {
            nodes.forEach((node, key) => {
                if (this._playoff.size > 0 &&
                    key === this._from &&
                    index === 0
                ) {
                    const middlePoint01 = node.parents[0].out;
                    const middlePoint02 = node.parents[1].out;
                    const average = (middlePoint02.y + middlePoint01.y) / 2;
                    node.position({
                        x: node.position().x,
                        y: average - nodeHeight / 2,
                    })
                }
                this.drawNode(node);
                this.drawBranchBig(node, index === 0);
            })
        });

        this._playoff.forEach(playoff => {
            this.drawNode(playoff.athlete01);
            this.drawNode(playoff.athlete02);
            this.drawBranch(playoff.athlete01);
            this.drawBranch(playoff.athlete02);
        });
    }

    private drawNode(node: Node) {
        const ctx = this._canvas.getContext('2d');
        const { x, y } = node.position();
        const { width, height } = node.size();
        ctx.fillStyle = '#EBEFF0';
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fill();
    }

    private drawBranch(node: Node, drawFrom: boolean = true) {
        const ctx = this._canvas.getContext('2d');
        ctx.strokeStyle = '#4B4B4B';
        ctx.beginPath();
        const to = node.to;
        ctx.moveTo(to[0].x, to[0].y);
        for (let i = 1; i < to.length; i++) {
            ctx.lineTo(to[i].x, to[i].y);
        }
        if (drawFrom) {
            const from = node.from;
            ctx.moveTo(from[0].x, from[0].y);
            for (let i = 1; i < from.length; i++) {
                ctx.lineTo(from[i].x, from[0].y);
            }
        }
        ctx.stroke();
    }

    private drawBranchBig(node: Node, drawFrom: boolean = true) {
        if (!node.child) {
            return;
        }
        const ctx = this._canvas.getContext('2d');
        ctx.strokeStyle = '#4B4B4B';
        ctx.beginPath();
        const childTop = node.child.top;
        const out = node.out;
        ctx.moveTo(out.x, out.y);
        ctx.lineTo(childTop.x, out.y);
        ctx.lineTo(childTop.x, childTop.y);

        if (drawFrom) {
            const from = node.from;
            ctx.moveTo(from[0].x, from[0].y);
            for (let i = 1; i < from.length; i++) {
                ctx.lineTo(from[i].x, from[0].y);
            }
        }

        // // for (let i = 1; i < to.length; i++) {
        // //     ctx.lineTo(to[i].x, to[i].y);
        // // }
        // ctx.lineTo(0, 0);
        // // if (drawFrom) {
        // //     const from = node.from;
        // //     ctx.moveTo(from[0].x, from[0].y);
        // //     for (let i = 1; i < from.length; i++) {
        // //         ctx.lineTo(from[i].x, from[0].y);
        // //     }
        // // }
        ctx.stroke();
    }

    private distributeVertical() {
        const totalCount = this._levels[0].size;
        const totalHeight = nodeHeight * totalCount;
        const spacing = ((this._size.height - totalHeight) / (totalCount - 1));
        this._levels[0].forEach((node, key) => {
            const index = key - this._from;
            node.position({
                ...node.position(),
                y: (nodeHeight + spacing) * index,
            })
        });

        for (let i = 1; i < this._levels.length; i++) {
            this._levels[i].forEach((node, key) => {
                const out1 = node.parents[0].out;
                const out2 = node.parents[1].out;
                const averageY = (out1.y + out2.y) / 2;
                node.position({
                    ...node.position(),
                    y: averageY - nodeHeight / 2,
                })
            });
        }
    }

    private distributePlayOffs() {
        this._playoff.forEach((playoff, key) => {
            if (key === this._from) {
                const firstSlot = { x: 0, y: 0 };
                const secondSlot = { x: 0, y: (playOffNodeHeight + 10) };
                playoff.athlete01.position(firstSlot);
                playoff.athlete02.position(secondSlot);
            } else if (key === this._levels[0].size) {
                const secondSlot = { x: 0, y: this._size.height - playOffNodeHeight };
                const firstSlot = { x: 0, y: secondSlot.y - (playOffNodeHeight + 10) };
                playoff.athlete01.position(firstSlot);
                playoff.athlete02.position(secondSlot);
            } else {
                const middlePoint = playoff.athlete01.child.in;
                const firstSlot = { x: 0, y: middlePoint.y - 5 - playOffNodeHeight };
                const secondSlot = { x: 0, y: firstSlot.y + (playOffNodeHeight + 10) };
                playoff.athlete01.position(firstSlot);
                playoff.athlete02.position(secondSlot);
            }
        })
    }

    private distributeHorizontal() {
        if (this._playoff.size === 0) {
            const totalWidth = nodeWidth * this._levels.length;
            const spacing = (this._size.width - totalWidth) / (this._levels.length - 1);
            this._levels.map((level, index) => {
                level.forEach(node => {
                    node.position({
                        ...node.position(),
                        x: (nodeWidth + spacing) * index,
                    })
                })
            });
        } else {
            const totalWidth = nodeWidth * this._levels.length;

            const spacing = (this._size.width - 150 - totalWidth) / (this._levels.length - 1);
            this._levels.map((level, index) => {
                level.forEach(node => {
                    node.position({
                        ...node.position(),
                        x: index === 0 ? 150 : (nodeWidth + spacing) * index + 150,
                    })
                })
            });
        }
    }
}

class Node {
    private _position: { x: number; y: number };
    private _size: { width: number; height: number };
    private _child: Node;
    private _parents: Node[];

    constructor(x: number, y: number, width: number, height: number) {
        this._position = { x, y };
        this._size = { width, height };
        this._child = null;
        this._parents = [];
    }

    get out() {
        return {
            x: this._position.x + this._size.width,
            y: this._position.y + this._size.height / 2,
        }
    }

    get in() {
        return {
            x: this._position.x,
            y: this._position.y + this._size.height / 2,
        }
    }

    get top() {
        return {
            x: this._position.x + this._size.width / 2,
            y: this._position.y,
        }
    }

    get bottom() {
        return {
            x: this._position.x + this._size.width / 2,
            y: this._position.y + this._size.height,
        }
    }

    get to() {
        if (!this._child) {
            return [
                this.out
            ];
        } else {
            return [
                this.out,
                {
                    x: this.out.x + (this._child.in.x - this.out.x) / 2,
                    y: this.out.y
                },
                {
                    x: this.out.x + (this._child.in.x - this.out.x) / 2,
                    y: this.out.y + (this._child.in.y - this.out.y),
                }
            ]
        }
    }

    get from() {
        if (this._parents.length === 0) {
            return [
                this.in
            ];
        } else {
            const average = { x: 0, y: 0 };
            const sum = { x: 0, y: 0 };

            this._parents.map(item => {
                sum.x += item.to[1].x;
                sum.y += item.to[1].y;
            })

            average.x = sum.x / this._parents.length;
            average.y = sum.y / this._parents.length;

            return [
                this.in,
                average,
            ]
        }
    }

    get parents() {
        return this._parents;
    }

    get child() {
        return this._child;
    }

    get hasParents() {
        return this._parents.length > 0;
    }

    position(pos?: { x: number; y: number }): { x: number; y: number } {
        if (pos) {
            this._position = pos;
        }
        return this._position;
    }

    size(sz?: { width: number; height: number }): { width: number; height: number } {
        if (sz) {
            this._size = sz;
        }
        return this._size;
    }

    converge(node: Node) {
        this._child = node;
        node._parents.push(this);
    }
}

export default new TournamentBracket();