
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrizesController')
export class PrizesController extends Component {

    @property({ type: Label })
    labelValue: Label;

    private priceSimbols: number[] = [0, 2, 5, 8, 10, 15, 20];
    private result: number = 0;
    private tier: number;

    start () {
        this.node.on('reels-finished', this.checkPrizes, this);
        this.node.on('reels-tier', this.checkTier, this);
    }

    private checkTier(tier: number) {
        this.tier = tier;
    }

    private checkPrizes(resultReelsSymbols: string[][]) {
        this.result += this.resultLined(resultReelsSymbols[2][0], resultReelsSymbols[2][1], resultReelsSymbols[2][2]);
        if (this.tier>1) {
            this.result += this.resultLined(resultReelsSymbols[1][0], resultReelsSymbols[1][1], resultReelsSymbols[1][2]);
            if(this.tier>2){
                this.result += this.resultLined(resultReelsSymbols[3][0], resultReelsSymbols[3][1], resultReelsSymbols[3][2]);
            }
        }
        this.labelValue.string = String(this.result);
    }

    newSpinValue(){
        this.result = 0;
        this.labelValue.string = String(this.result);
    }

    private resultLined(s1: string, s2: string, s3: string) {
        if(s1 == s2 && s2 == s3){
            const p = Number([s1.length - 1]);
            return this.priceSimbols[p];
        }
        return 0;
    }
}

