import { _decorator, Component, Node, tween, Vec3,  TweenSystem, Sprite, SpriteFrame} from 'cc';
import {SymbolsRNG} from "db://assets/Scripts/Slot/SymbolsRNG";
const { ccclass, property } = _decorator;
 
@ccclass('ReelMovement')
export class ReelMovement extends Component {

    @property([SpriteFrame])
    private spriteSymbolsFrames: SpriteFrame[] = [];

    private minY: number = -334;
    private maxY: number = 501;
    private duration: number = 1;
    private spacingY: number = 167;
    private symbols: Node[] = [];
    private spinning: boolean = false;
    private winSymbols: string[]= [];

    start () {
        this.symbols = this.node.children;
    }

    reelStartMovement() {
        this.spinning = true;
        this.winSymbols = [];
        this.symbols.slice().reverse().forEach((symbol, index) => {
            this.moveSymbol(symbol, index)
        })
        this.scheduleOnce(() => {
            this.reelEndMovement();
        }, 4)
    }

    reelEndMovement() {
        this.spinning = false;
        this.symbols.forEach(symbol => {
            TweenSystem.instance.ActionManager.removeAllActionsFromTarget(symbol);
        });
        this.stopSymbol();
        this.eventEndReel();

    }

    stopSymbol(){
        let newY: number = 668;
        let duration = 0.7;
        const orderedSymbols = this.symbols.slice().sort((a, b) => b.position.y - a.position.y);

        for (let i = 0; i < orderedSymbols.length; i++) {
            const symbol = orderedSymbols[i];
            newY = newY-this.spacingY;
            if (i > 1) {
                const sprite = symbol.getComponent(Sprite);
                this.winSymbols.push(sprite.spriteFrame.name);
            }
            tween(symbol)
                .to(duration, { position: new Vec3(0, newY, 0) }, { easing: 'elasticOut' })
                .start();
        }

    }

    private eventEndReel() {
        this.node.emit('end-reel',this.winSymbols);
    }

    moveSymbol(symbol: Node, index: number) {
        const startPosition = symbol.position.clone();
        const moveStep = () => {
            const distanceToTravel = symbol.position.y - this.minY;
            const speed = (this.maxY - this.minY) / this.duration;
            const symbolDuration = distanceToTravel / speed;
            if (!this.spinning) return;
            tween(symbol)
                .delay(distanceToTravel / speed * 0.1)
                .to(symbolDuration, {position: new Vec3(0, this.minY, 0)})
                .call(() => {
                    //mueve los simbolos para arriba
                    symbol.setPosition(symbol.position.x, this.maxY, symbol.position.z);
                    const randomIndex = SymbolsRNG.randomSymbol();
                    const spriteFrame = this.spriteSymbolsFrames[randomIndex];
                    const sprite = symbol.getComponent(Sprite) || symbol.addComponent(Sprite);
                    sprite.spriteFrame = spriteFrame;
                    moveStep();
                })
                .start();
        }
        moveStep();
    }
}
