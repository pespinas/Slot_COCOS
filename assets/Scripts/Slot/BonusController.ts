
import { _decorator, Component, Node, Vec3,instantiate,Prefab} from 'cc';
import {SlotController} from "db://assets/Scripts/Slot/SlotController";
const { ccclass, property } = _decorator;

@ccclass('BonusController')
export class BonusController extends Component {

    @property({ type: Prefab })
    ssxPrefab: Prefab | null = null;
    @property({ type: [Node] })
    overlay = [];
    private anyNewSSX: boolean = false;
    private slot;
    private bonusResult: string [][];



    start () {
        this.slot = this.getComponent(SlotController);
        this.bonusResult = Array.from({ length: 3 }, () => Array(3).fill(""));
        this.node.on('bonus-spin', this.bonusSpin, this);
    }
    private bonusSpin(results: string[][], tier:number){
        this.anyNewSSX = false;
        const columnsToCheck = [0, 1, 2];
        for (let i = 0; i < columnsToCheck.length; i++) {
            const column = results.map(row => row[i]);
            this.checkBonusPrize(column,i);
        }
        this.slot.bonusPending = this.anyNewSSX;
        if(!this.slot.bonusPending){
            this.resetBonusFreeze();
        }
    }
    private checkBonusPrize(column:string[], colIndex:number){
        for (let i = 0; i < column.length; i++) {
            if (column[i] === "SSX"){
                this.checkWinAlready(i,colIndex);
            }
        }
    }
    private checkWinAlready(rowIndex: number, colIndex: number){

        if(this.bonusResult[rowIndex][colIndex] != "SSX"){
            this.bonusResult[rowIndex][colIndex] = "SSX";
            this.bonusFreezer(colIndex, rowIndex);
            this.anyNewSSX = true;
        }
    }
    private bonusFreezer(colIndex: number, position: number){
        const maskNode = this.overlay[colIndex];
        const rowToY = [ 167, 0, -167 ];
        const ssx = instantiate(this.ssxPrefab);
        maskNode.addChild(ssx);
        ssx.setPosition(new Vec3(0, rowToY[position], 1));
    }
    public resetBonusFreeze() {
        this.overlay.forEach(mask => {
            mask.children.forEach(child => child.destroy());
        });
        for (let i = 0; i < this.bonusResult.length; i++) {
            for (let j = 0; j < this.bonusResult[i].length; j++) {
                this.bonusResult[i][j] = "";
            }
        }
    }

    private
}

