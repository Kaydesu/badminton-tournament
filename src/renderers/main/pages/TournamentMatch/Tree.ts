import { paddingLeft, paddingTop, spacing, size } from "@utils/constants";
import MATCH_TEMPLATES from "./matchTemplates";

const hasPlayoff = (entries: number) => ![4, 8, 16, 32].includes(entries);

type MatchType = 'normal' | 'playoff';

class TournamentBracket {
    private _canvas: HTMLCanvasElement;
    private _slots: {
        id: number | number[];
        slot: Slot;
    }[];

    private _levels: Map<number, {
        id: number | number[];
        slot: Slot;
    }[]>;

    constructor() {
        this._canvas = null;
        this._slots = [];
        this._levels = new Map();
    }

    initialize(width: number, height: number, container: string) {
        const ratio = window.devicePixelRatio;
        this._canvas = document.createElement('canvas');
        this._canvas.width = width * ratio;
        this._canvas.height = height * ratio;
        this._canvas.style.width = width + "px";
        this._canvas.style.height = height + "px";
        this._canvas.getContext("2d").scale(ratio, ratio);

        if (!document.getElementById(container).querySelector('canvas')) {
            document.getElementById(container).appendChild(this._canvas);
        }
    }

    createLevels(entries: number) {
        let label = 1;
        if (hasPlayoff(entries)) {
            const template = MATCH_TEMPLATES.get(entries) as MatchType[];
            template.map((matchType, index) => {
                const slot = matchType === 'normal' ? new Slot(size / 2, 0, size) : new Slot(0, 0, size, true);
                if (matchType === 'normal') {
                    slot.label = [label];
                } else {
                    slot.label = [label, label += 1];
                }
                label += 1;
                this._slots.push({
                    id: index + 1,
                    slot: slot
                });
            });
        } else {
            for (let i = 0; i < entries; i++) {
                const slot = new Slot(0, 0, size);
                slot.label = [label];
                label += 1;
                this._slots.push({
                    id: i + 1,
                    slot: slot
                })
            }
        }

        //Create lower levels:
        let level = 1;
        let id = 0;
        const firstLevelSlots = this._slots.length;

        for (let i = firstLevelSlots / 2; i >= 1; i /= 2) {
            let arrayId = new Array(i).fill(0).map((_, i) => {
                id += 1;
                return id;
            });
            this._levels.set(level, arrayId.map((id) => ({
                id: id,
                slot: new Slot(0, 0, 100)
            })))
            level += 1;
        }
    }

    generateBallots() {
        const ballots: {
            ballot: number;
            id: number;
            isPlayoff: boolean;
            position: { x: number, y: number };
        }[] = [];

        this._slots.map((item) => {
            if (item.slot.label.length === 1) {
                ballots.push({
                    id: item.slot.label[0],
                    ballot: item.id as number,
                    isPlayoff: false,
                    position: { ...item.slot.position() },
                })
            } else {
                ballots.push({
                    id: item.slot.label[0],
                    ballot: item.id as number,
                    isPlayoff: true,
                    position: { x: item.slot.position().x, y: item.slot.top },
                });
                ballots.push({
                    id: item.slot.label[1],
                    ballot: item.id as number,
                    isPlayoff: true,
                    position: { x: item.slot.position().x, y: item.slot.bottom },
                })
            }
        })
        return ballots;
    }

    generateMatchIds(entries: number) {
        const matches: {
            id: number;
            position: { x: number; y: number };
        }[] = []
        let matchId = 0;
        if (hasPlayoff(entries)) {
            this._slots.map(item => {
                item.slot.isPlayOff && matches.push({
                    id: matchId += 1,
                    position: { x: item.slot.tail.x - size / 2, y: item.slot.tail.y },
                })
            });
        }
        this._levels.forEach(level => {
            level.map((item) => {
                matches.push({
                    id: matchId += 1,
                    position: item.slot.position(),
                })
            })
        });

        return matches;
    }

    clear() {
        const context = this._canvas.getContext('2d');
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    render() {
        this.distributeVertical();
        this.distributeLevels();
        this._slots.map(slot => {
            this.drawNode(slot.slot);
        });
        this._levels.forEach(level => {
            level.map(item => {
                this.drawNode(item.slot);
            })
        })
    }

    private distributeVertical() {
        this._slots.map((item, index) => {
            if (item.id !== 1) {
                const prevSlot = this._slots[index - 1];
                item.slot.position({
                    ...item.slot.position(),
                    y: prevSlot.slot.bottom + spacing,
                });
            } else {
                item.slot.position({ ...item.slot.position(), y: 0 });
            }
        });
    }

    private distributeLevels() {
        this._levels.forEach((level, key) => {
            if (key === 1) {
                level.map((item, index) => {
                    const slotParent01 = this._slots[index * 2];
                    const slotParent02 = this._slots[index * 2 + 1];

                    item.slot.position({
                        x: Math.max(slotParent01.slot.tail.x, slotParent02.slot.tail.x),
                        y: (slotParent01.slot.tail.y + slotParent02.slot.tail.y) / 2,
                    });
                    item.slot.parents = [slotParent01.slot, slotParent02.slot];
                });
            } else {
                level.map((item, index) => {
                    const slotParent01 = this._levels.get(key - 1)[index * 2];
                    const slotParent02 = this._levels.get(key - 1)[index * 2 + 1];
                    item.slot.position({
                        x: slotParent01.slot.tail.x,
                        y: (slotParent01.slot.tail.y + slotParent02.slot.tail.y) / 2,
                    });
                    item.slot.parents = [slotParent01.slot, slotParent02.slot];
                });
            }
        });
    }

    private drawNode(node: Slot) {
        const ctx = this._canvas.getContext('2d');
        node.draw(ctx);
    }

    get canvas() {
        return this._canvas;
    }
}


class Slot {
    private _position: { x: number; y: number };
    private _size: number;
    private _parents: Slot[];
    public label: number[];
    public againts: number;
    private _top: number;
    private _bottom: number;
    private _tail: { x: number; y: number };
    public isPlayOff: boolean;

    constructor(x: number, y: number, size: number, isPlayOff: boolean = false) {
        this._size = size;
        this.label = [];
        this._parents = [];
        this.isPlayOff = isPlayOff;
        this.position({ x, y });
    }

    get top() {
        return this._top;
    }

    get bottom() {
        return this._bottom;
    }

    get tail() {
        return this._tail;
    }

    set parents(slots: Slot[]) {
        this._parents = slots;
    }

    get parents() {
        return this._parents;
    }

    position(pos?: { x: number; y: number }): { x: number; y: number } {
        if (pos) {
            if (!this.isPlayOff) {
                this._position = pos;
                this._top = pos.y;
                this._bottom = pos.y;
                this._tail = {
                    x: this._position.x + this._size,
                    y: pos.y
                }
            } else {
                this._position = pos;
                this._top = pos.y;
                this._bottom = pos.y + spacing;
                this._tail = {
                    x: this._position.x + this._size + size / 2,
                    y: pos.y + spacing / 2,
                }
            }
        }
        return this._position;
    }

    size(sz?: number): number {
        if (sz) {
            this._size = sz;
        }
        return this._size;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const { x, y } = this._position;
        const size = this._size;
        if (!this.isPlayOff) {
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + paddingLeft, y + paddingTop);
            ctx.lineTo(x + paddingLeft + size, y + paddingTop);
            ctx.stroke();
        } else {
            // Draw slot 1:
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + paddingLeft, y + paddingTop);
            ctx.lineTo(x + paddingLeft + size, y + paddingTop);
            ctx.stroke();
            // Draw slot 2:
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + paddingLeft, y + paddingTop + spacing);
            ctx.lineTo(x + paddingLeft + size, y + paddingTop + spacing);
            ctx.stroke();
            // Connect slots:
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(x + paddingLeft + size, this.top + paddingTop);
            ctx.lineTo(x + paddingLeft + size, this.bottom + paddingTop);
            ctx.stroke();
            // Draw output:
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(this._tail.x + paddingLeft, this._tail.y + paddingTop);
            ctx.lineTo(this._tail.x - size / 2 + paddingLeft, this._tail.y + paddingTop);
            ctx.stroke();
        }
        if (this._parents.length > 0) {
            const parent01 = this._parents[0];
            const parent02 = this._parents[1];
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(parent01.tail.x + paddingLeft, parent01.tail.y + paddingTop);
            ctx.lineTo(parent02.tail.x + paddingLeft, parent02.tail.y + paddingTop);
            ctx.stroke();
        }
    }
}

export default new TournamentBracket();