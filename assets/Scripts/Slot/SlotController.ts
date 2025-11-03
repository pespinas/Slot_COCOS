
import { _decorator, Component, Node, Prefab, instantiate, Button } from 'cc';
import { ReelMovement } from './ReelMovement';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: Prefab })
    symbolPref: Prefab | null = null;
    @property({ type: Button })
    spinButton: Button | null = null;
    @property({ type: [Node] })
    masks = [];

    private countEnds: number = 0;

    private reels: ReelMovement[] = [];

    start () {
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

    private reelsEnd(){
        this.countEnds++;
        if (this.countEnds == this.masks.length) {
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

    }
}

