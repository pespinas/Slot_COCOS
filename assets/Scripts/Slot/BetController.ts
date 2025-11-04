
import { _decorator, Component,EventTouch, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('BetController')
export class BetController extends Component {

    @property({ type: Button })
    plusButton: Button;
    @property({ type: Button })
    minusButton: Button;
    @property({ type: Label })
    labelBet: Label;

    private labelValue: number;
    private nPosition: number;
    private betValue: number[] = [5, 10, 15, 20, 25, 30];

    start () {
        this.labelValue = Number(this.labelBet.string);
        this.updateButtonBetStart(this.labelValue);
        this.nPosition = this.betValue.indexOf(this.labelValue);
    }

    private updateButtonBetStart(bet: number){
        this.plusButton.interactable = bet < this.betValue[this.betValue.length - 1];
        this.minusButton.interactable = bet > this.betValue[0];

    }

    buttonBet(event: EventTouch, customEventData: string){
        const nextPos = this.nPosition + Number(customEventData);
        const nextBet = this.betValue[nextPos];

        this.nPosition = nextPos;
        this.labelBet.string = String(nextBet);
        this.updateButtonBetStart(nextBet);
    }
}