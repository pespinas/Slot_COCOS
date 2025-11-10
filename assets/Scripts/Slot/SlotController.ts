
import { _decorator, Component, Node, Prefab, instantiate, Button, EditBox } from 'cc';
import { ReelMovement } from './ReelMovement';
import { PrizesController } from './PrizesController';
import {BetController} from "db://assets/Scripts/Slot/BetController";
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: Prefab })
    symbolPref: Prefab;
    @property({ type: Button })
    spinButton: Button;
    @property({ type: Button })
    plusButton: Button;
    @property({ type: Button })
    minusButton: Button;
    @property({ type: [Node] })
    masks = [];
    @property({ type: EditBox })
    cheat: EditBox;

    private countEnds: number = 0;
    private prizesController: PrizesController
    private betController: BetController
    private reels: ReelMovement[] = [];
    private resultReelsSymbols: string[][] = [];
    private minuState: boolean;
    private plusState: boolean;

    start () {
        this.prizesController = this.getComponent(PrizesController);
        this.betController = this.getComponent(BetController);
        this.masks.forEach(mask => {
            if (mask && this.symbolPref) {
                const newReel = instantiate (this.symbolPref);
                mask.addChild(newReel);

                const reelMovement = newReel.getComponent(ReelMovement);
                if (reelMovement) {
                    this.reels.push(reelMovement);
                    newReel.on('end-reel', this.reelsEnd, this);
                }
            }
        })

    }

    private reelsEnd(winSymbols: string[]){
        this.resultReelsSymbols[this.countEnds] = winSymbols;
        this.countEnds++;
        if (this.countEnds == this.masks.length) {
            this.node.emit('reels-finished', this.resultReelsSymbols);
            this.scheduleOnce(() => {
                this.setButtosInteractable(true);
            }, 0.3);

            this.countEnds = 0;
            this.resultReelsSymbols = [];
        }
    }

    onSpinClick() {
        if (!this.betController.spinBalanceUpdate()){
            console.log("no hay saldo");
        }
        else{
            this.reels.forEach((reel, index)=> {
                this.scheduleOnce(() => {
                    reel.reelStartMovement(this.isCheating());
                }, index * 0.4);
            });
            this.setButtosInteractable(false);
            this.prizesController.newSpinValue();
        }
    }
    private setButtosInteractable(state: boolean) {
        this.spinButton.interactable = state;
        if(!state){
            this.minuState = this.minusButton.interactable;
            this.plusState = this.plusButton.interactable;

            this.plusButton.interactable = state;
            this.minusButton.interactable = state;
        }
        else{
            this.plusButton.interactable = this.plusState;
            this.minusButton.interactable = this.minuState;
        }
    }
    getSymbol() {
        const allChildren: Node[] = [];
        this.masks.forEach(mask => {
            allChildren.push(...mask.children);
        });
    }

    isCheating(){
        const checkCheat = Number(this.cheat?.string ?? 0);
        if(checkCheat>0 && checkCheat<7){
            return checkCheat;
        }
        else{
            return 0;
        }
    }
}

