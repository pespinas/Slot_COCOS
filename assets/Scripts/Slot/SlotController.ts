
import { _decorator, Component, Node, Prefab, instantiate, Button } from 'cc';
import { ReelMovement } from './ReelMovement';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SlotController
 * DateTime = Sat Oct 18 2025 12:03:38 GMT+0200 (hora de verano de Europa central)
 * Author = pespinas
 * FileBasename = SlotController.ts
 * FileBasenameNoExtension = SlotController
 * URL = db://assets/Scripts/Slot/SlotController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: Prefab })
    symbolPref = null;
    @property({ type: [Node] })
    masks = [];

    private reels: ReelMovement[] = [];

    start () {
        this.masks.forEach(mask => {
            if (mask && this.symbolPref) {
                const newReel = instantiate (this.symbolPref);
                mask.addChild(newReel);

                const reelMovement = newReel.getComponent(ReelMovement);
                if (reelMovement) {
                    this.reels.push(reelMovement);
                }
            }
        })

    }

    onSpinClick() {
        this.reels.forEach((reel, index)=> {
            this.scheduleOnce(() => {
                reel.reelStartMovement();
            }, index * 0.4);

        });

    }
}

