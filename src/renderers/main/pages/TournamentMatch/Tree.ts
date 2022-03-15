import { v4 as uniqueId } from 'uuid';

const nodeWidth = 80;
const nodeHeight = 30;

class TournamentBracket {
    private _canvas: HTMLCanvasElement;

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

    get canvas() {
        return this._canvas;
    }

    // drawBranch(node: Node) {
    //     const ctx = this._canvas.getContext('2d');
    //     ctx.strokeStyle = '#4B4B4B';
    //     ctx.beginPath();
    //     const to = node.to;
    //     ctx.moveTo(to[0].x, to[0].y);
    //     for (let i = 1; i < to.length; i++) {
    //         ctx.lineTo(to[i].x, to[i].y);
    //     }

    //     const from = node.from;
    //     ctx.moveTo(from[0].x, from[0].y);
    //     for (let i = 1; i < from.length; i++) {
    //         ctx.lineTo(from[i].x, from[i].y);
    //     }

    //     ctx.stroke();
    // }
}

export class Tree {
    private _direction: 'toRight' | 'toLeft';
    private _canvas: HTMLCanvasElement;
    private _levels: Map<number, Node>[];
    private _playoff: {
        athlete01: Node;
        athlete02: Node;
        to: number;
    }[]
    private _position: { x: number; y: number };
    private _size: { width: number; height: number };

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
        this._playoff = [];
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
        this.createPlayOff(7);
    }

    createPlayOff(to: number) {
        const athlete01 = new Node(0, 0, nodeWidth, nodeHeight);
        const athlete02 = new Node(0, 0, nodeWidth, nodeHeight);
        athlete01.converge(this._levels[0].get(to));
        athlete02.converge(this._levels[0].get(to));
        this._playoff.push({
            athlete01,
            athlete02,
            to,
        })
    }

    render() {
        this.distributeVertical();
        this.distributeHorizontal();
        this._levels.map((nodes, index) => {
            nodes.forEach(node => {
                this.drawNode(node);
                this.drawBranch(node, index !== 0);
            })
        });
        this._playoff.map(playoff => {
            this.drawNode(playoff.athlete01);
            this.drawNode(playoff.athlete02);
            this.connectToChild(playoff.athlete01);
            this.connectToChild(playoff.athlete02);
        })
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
                ctx.lineTo(from[i].x, from[i].y);
            }
        }
        ctx.stroke();
    }

    private connectToChild(node: Node) {
        const ctx = this._canvas.getContext('2d');
        ctx.strokeStyle = '#4B4B4B';
        ctx.beginPath();
        const out = node.out;
        const child = node.child;
        const to = child.in;
        ctx.moveTo(out.x, out.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    private distributeVertical() {
        if (this._playoff.length > 0) {
            const totalCount = this._levels[0].size;
            const totalHeight = nodeHeight * totalCount;
            const spacing = ((this._size.height - totalHeight) / (totalCount - 1));
            this._levels[0].forEach((node, key) => {
                const index = Number(key) - 1;
                node.position({
                    ...node.position(),
                    y: (nodeHeight + spacing) * index,
                })
            });

            this._playoff.forEach((playoff, index) => {
                const child = playoff.athlete01.child;
                playoff.athlete01.position({
                    x: 0,
                    y: child.position().y === 0 ? 0 : child.position().y - nodeHeight * 1.5,
                });

                playoff.athlete02.position({
                    x: 0,
                    y: (child.position().y + nodeHeight) === this._size.height ?
                        this._size.height - nodeHeight :
                        child.position().y + nodeHeight * 1.5,
                });
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
        } else {
            const totalCount = this._levels[0].size;
            const totalHeight = nodeHeight * totalCount;
            const spacing = ((this._size.height - totalHeight) / (totalCount - 1));
            this._levels[0].forEach((node, key) => {
                const index = Number(key) - 1;
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
    }

    private distributeHorizontal() {
        if (this._playoff.length === 0) {
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
            const totalWidth = nodeWidth * (this._levels.length + 1);
            const spacing = (this._size.width - totalWidth) / (this._levels.length + 1);
            this._levels.map((level, index) => {
                level.forEach(node => {
                    node.position({
                        ...node.position(),
                        x: (nodeWidth + spacing) * (index + 1),
                    })
                })
            });
        }
    }

    private setNodeSize(size: { width: number, height: number }) {
        this._levels.map(nodes => {
            nodes.forEach(node => {
                node.size(size);
            })
        })
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