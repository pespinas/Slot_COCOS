
import { _decorator, Component, Node, Prefab, instantiate, Button } from 'cc';
import { ReelMovement } from './ReelMovement';
import { PrizesController } from './PrizesController';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: Prefab })
    symbolPref: Prefab;
    @property({ type: Button })
    spinButton: Button;
    @property({ type: [Node] })
    masks = [];

    private countEnds: number = 0;
    private prizesController: PrizesController
    private reels: ReelMovement[] = [];
    private resultReelsSymbols: string[][] = [];

    start () {
        this.prizesController = this.getComponent(PrizesController);
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
        this.countEnds++;
        this.resultReelsSymbols[this.countEnds] = winSymbols;
        if (this.countEnds == this.masks.length) {
            this.node.emit('reels-finished', this.resultReelsSymbols);
            this.scheduleOnce(() => {
                this.spinButton.interactable = true;
            }, 0.3);

            this.countEnds = 0;
        }
    }

    onSpinClick() {
        this.reels.forEach((reel, index)=> {
            this.spinButton.interactable = false;
            this.scheduleOnce(() => {
                reel.reelStartMovement();
            }, index * 0.4);
        });
        this.prizesController.newSpinValue();
    }

    getSymbol() {
        const allChildren: Node[] = [];
        this.masks.forEach(mask => {
            allChildren.push(...mask.children);
        });
    }
}

