
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrizesController')
export class PrizesController extends Component {

    @property({ type: Label })
    labelValue: Label;
    @property({ type: Label })
    labelBalance: Label;

    private priceSimbols: number[] = [0, 4, 6, 8, 12, 19, 30, 50];
    private result: number = 0;
    private tier: number;


    start () {
        this.node.on('reels-finished', this.checkPrizesOrder, this);
        this.node.on('bonus-finished', this.checkbonus, this);
        this.node.on('reels-tier', this.checkTier, this);
    }

    protected onDestroy(): void {
        this.node.off('reels-finished', this.checkPrizesOrder, this);
        this.node.off('bonus-finished', this.checkbonus, this);
        this.node.off('reels-tier', this.checkTier, this);
    }

    private checkTier(tier: number) {
        this.tier = tier;
    }
    private checkPrizesOrder(resultReelsSymbols: string[][], bonus: boolean = false){
        const result = [
            [resultReelsSymbols[0][0], resultReelsSymbols[1][0], resultReelsSymbols[2][0]],
            [resultReelsSymbols[0][1], resultReelsSymbols[1][1], resultReelsSymbols[2][1]],
            [resultReelsSymbols[0][2], resultReelsSymbols[1][2], resultReelsSymbols[2][2]]
        ];
        if(bonus) this.node.emit('bonus-spin', result, this.tier);
        else{
            this.checkPrizes(result);
        }
    }

    private checkPrizes(results: string[][]) {
        this.result += this.resultLined(results[1][0], results[1][1], results[1][2]);
        if (this.tier>1) {
            this.result += this.resultLined(results[0][0], results[0][1], results[0][2]);
            if(this.tier>2){
                this.result += this.resultLined(results[2][0], results[2][1], results[2][2]);
            }
        }
        this.labelValue.string = String(this.result);
        this.balanceUpdate(Number(this.result));
    }

    private checkbonus(results: string[][]) {
        this.result += this.resultLined(results[1][0], results[1][1], results[1][2]);
        this.result += this.resultLined(results[0][0], results[0][1], results[0][2]);
        this.result += this.resultLined(results[2][0], results[2][1], results[2][2]);
        this.labelValue.string = String(this.result);
        this.balanceUpdate(Number(this.result));
    }


    private balanceUpdate(win: number){
        const currentBalance = Number(this.labelBalance.string);
        const newBalance = currentBalance + win;
        this.labelBalance.string = String(newBalance);
    }

    public newSpinValue(){
        this.result = 0;
        this.labelValue.string = String(this.result);
    }

    private resultLined(s1: string, s2: string, s3: string) {
        if(s1 == s2 && s2 == s3){
            if(s1 == "SSX") return this.priceSimbols[7];
            const p = Number(s1[2]);
            if(p == 4) this.node.emit('bonus-isPending', true);
            return this.priceSimbols[p];
        }
        return 0;
    }


}

