
import { _decorator, Component, Node, Vec3,instantiate,Prefab,SpriteFrame,Sprite} from 'cc';
import {SlotController} from "db://assets/Scripts/Slot/SlotController";
const { ccclass, property } = _decorator;

@ccclass('BonusController')
export class BonusController extends Component {

    @property({type: Prefab})
    ssxPrefab: Prefab | null = null;
    @property({type: [Node]})
    overlay = [];
    @property({ type: [Node] })
    masks = [];
    @property({ type: SpriteFrame })
    ssxFrame: SpriteFrame | null = null;
    private anyNewSSX: boolean = false;
    private bonusResult: string [][];
    private rowToY = [167, 0, -167];

    start() {
        this.bonusResult = Array.from({length: 3}, () => Array(3).fill(""));
        this.node.on('bonus-spin', this.bonusSpin, this);

    }
    protected onDestroy(): void {
        this.node.off('bonus-spin', this.bonusSpin, this);
    }
    private bonusSpin(results: string[][], tier: number) {
        this.anyNewSSX = false;
        const columnsToCheck = [0, 1, 2];
        for (let i = 0; i < columnsToCheck.length; i++) {
            const column = results.map(row => row[i]);
            this.checkBonusPrize(column, i);
        }
        this.node.emit('bonus-isPending', this.anyNewSSX);
        if (!this.anyNewSSX) {
            this.node.emit('bonus-finished', this.bonusResult);
            this.scheduleOnce(() => {
                this.fakeEndBonus();
                this.resetBonusFreeze();
            }, 0.75);
        }
    }

    private checkBonusPrize(column: string[], colIndex: number) {
        for (let i = 0; i < column.length; i++) {
            if (column[i] === "SSX") {
                this.checkWinAlready(i, colIndex);
            }
        }
    }

    private checkWinAlready(rowIndex: number, colIndex: number) {

        if (this.bonusResult[rowIndex][colIndex] != "SSX") {
            if (this.isBonusFullSSX()) return;
            this.bonusResult[rowIndex][colIndex] = "SSX";
            this.bonusFreezer(colIndex, rowIndex);
            this.anyNewSSX = true;
        }
    }

    private bonusFreezer(colIndex: number, position: number) {
        const maskNode = this.overlay[colIndex];
        const ssx = instantiate(this.ssxPrefab);
        maskNode.addChild(ssx);
        ssx.setPosition(new Vec3(0, this.rowToY[position], 1));
    }

    private resetBonusFreeze() {
        this.overlay.forEach(mask => {
            mask.children.forEach(child => child.destroy());
        });
        for (let i = 0; i < this.bonusResult.length; i++) {
            for (let j = 0; j < this.bonusResult[i].length; j++) {
                this.bonusResult[i][j] = "";
            }
        }
    }

    private fakeEndBonus() {
        const tolerance = 10;

        for (let colIndex = 0; colIndex < this.masks.length; colIndex++) {
            const mask = this.masks[colIndex];
            const reelNode = mask.children[0];

            for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
                if (this.bonusResult[rowIndex][colIndex] !== "SSX") continue;
                const targetY = this.rowToY[rowIndex];
                const symbolNode = reelNode.children.find(n => Math.abs(n.position.y - targetY) <= tolerance);
                const sprite = symbolNode.getComponent(Sprite) || symbolNode.addComponent(Sprite);
                sprite.spriteFrame = this.ssxFrame;
            }
        }
    }
    private isBonusFullSSX(): boolean {
        for (let row = 0; row < this.bonusResult.length; row++) {
            for (let col = 0; col < this.bonusResult[row].length; col++) {
                if (this.bonusResult[row][col] !== "SSX") return false;
            }
        }
        return true;
    }
}


