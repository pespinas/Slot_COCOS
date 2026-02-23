
import { _decorator, Component, Node, Prefab, instantiate, Button, EditBox,JsonAsset,resources,sys } from 'cc';
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
    private maskIndex: number = 0;
    private prizesController: PrizesController
    private betController: BetController
    private reels: ReelMovement[] = [];
    private resultReelsSymbols: string[][] = [];
    private minuState: boolean;
    private plusState: boolean;
    public bonusPending: boolean = false;

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
                    reelMovement.initReel(this.maskIndex);
                    this.maskIndex++;
                    newReel.on('end-reel', this.reelsEnd, this);
                }
            }
        })

    }
    onLoad() {
        resources.load('RefreshSave', JsonAsset, (err, asset) => {
            const data = asset.json;
        });
    }

    bonusStart(){
        this.bonusPending = true;
        this.setButtosInteractable(false);
        this.scheduleOnce(() => {
            this.onSpinClick(6, false);
        }, 1);
    }
    private reelsEnd(winSymbols: string[]){
        this.resultReelsSymbols[this.countEnds] = winSymbols;
        this.countEnds++;
        if (this.countEnds == this.masks.length) {
            this.node.emit('reels-finished', this.resultReelsSymbols);
            this.scheduleOnce(() => {
                if (!this.bonusPending){
                    this.setButtosInteractable(true);
                }
            }, 0.3);
            this.countEnds = 0;
            this.saveRefresh(this.resultReelsSymbols);
            this.resultReelsSymbols = [];
            if(this.bonusPending){
                this.bonusStart();
            }

        }
    }

    onSpinClick(cheat:number = 0, changeBalance: boolean = true) {
        if (!this.betController.spinBalanceUpdate(changeBalance)){
            console.log("no hay saldo");
        }
        else{
            this.reels.forEach((reel, index)=> {
                this.scheduleOnce(() => {
                    if(this.bonusPending) reel.reelStartMovement(cheat);
                    else{
                        reel.reelStartMovement(this.isCheating());
                    }
                }, index * 0.4);
            });
            this.setButtosInteractable(false);
            this.prizesController.newSpinValue();
        }
    }
    private setButtosInteractable(state: boolean,) {
        this.spinButton.interactable = state;
        if(!state){
            if(!this.bonusPending){
                this.minuState = this.minusButton.interactable;
                this.plusState = this.plusButton.interactable;
            }

            this.plusButton.interactable = state;
            this.minusButton.interactable = state;
        }
        else{
            this.plusButton.interactable = this.plusState;
            this.minusButton.interactable = this.minuState;
        }
    }

    saveRefresh(resultReelsSymbols: string[][]){
        sys.localStorage.setItem(
            "slotData",
            JSON.stringify(resultReelsSymbols)
        );
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

