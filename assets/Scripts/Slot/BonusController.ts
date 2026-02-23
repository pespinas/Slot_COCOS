
import { _decorator, Component, Node } from 'cc';
import {SlotController} from "db://assets/Scripts/Slot/SlotController";
const { ccclass, property } = _decorator;

@ccclass('BonusController')
export class BonusController extends Component {

    private slot;
    private bonusResult: string [][];

    start () {
        this.slot = this.getComponent(SlotController);
        this.bonusResult = Array.from({ length: 3 }, () => Array(3).fill(""));
        this.node.on('bonus-spin', this.bonusSpin, this);
    }
    private bonusSpin(results: string[][], tier:number){
        const columnsToCheck = [0, 1, 2];
        for (let i = 0; i < columnsToCheck.length; i++) {
            const column = results.map(row => row[i]);
            this.checkBonusPrize(column,i);
        }
    }
    private checkBonusPrize(fila:string[], colIndex:number){
        for (let i = 0; i < fila.length; i++) {
            if (fila[i] === "SSX"){
                this.checkWinAlready(i,colIndex);
            }
            else{
               this.slot.bonusPending = false;
            }
        }

    }
    private checkWinAlready(position: number, colIndex: number){
        let anyNewSSX = false;
        if(this.bonusResult[colIndex][position] != "SSX"){
            this.bonusResult[colIndex][position] = "SSX";
            anyNewSSX = true;
        }
        if (anyNewSSX) this.slot.bonusPending = true;
    }

}

