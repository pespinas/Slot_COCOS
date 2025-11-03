
import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('BetController')
export class BetController extends Component {

    @property({ type: Button })
    plusButton: Button | null = null;
    @property({ type: Button })
    minusButton: Button | null = null;
    @property({ type: Label })
    labelBet: Label | null = null;
    private labelValue: number;
    private nPosition: number;
    private betValue: number[] = [5, 10, 15, 20, 25, 30];



    start () {
        this.labelValue = Number(this.labelBet.getComponent(Label).string);
        this.updateButtonBetStart(this.labelValue);
        this.nPosition = this.betValue.indexOf(this.labelValue);
    }

    private updateButtonBetStart(bet: number){
        this.plusButton.interactable = bet < this.betValue[this.betValue.length - 1];
        this.minusButton.interactable = bet > this.betValue[0];
    }

    plusBet(){
        const nextPos = this.nPosition + 1;
        const nextBet = this.betValue[nextPos];
        this.nPosition = nextPos;
        this.labelBet.getComponent(Label).string = nextBet + '';
        this.updateButtonBetStart(nextBet);

    }
    minusBet(){
        const nextPos = this.nPosition - 1;
        const nextBet = this.betValue[nextPos];
        this.nPosition = nextPos;
        this.labelBet.getComponent(Label).string = nextBet + '';
        this.updateButtonBetStart(nextBet);
    }
}