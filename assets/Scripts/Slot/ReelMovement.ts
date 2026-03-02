import { _decorator, Component, Node, tween, Graphics, Vec3,  TweenSystem, Sprite, SpriteFrame, sys} from 'cc';
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
    private reelIndex: number = -1;

    public initReel(index: number) {
        this.reelIndex = index;
    }
    private getReelIndex(){
        const data = sys.localStorage.getItem("slotData");
        return JSON.parse(data)[this.reelIndex];
    }
    start () {
        this.symbols = this.node.children;
        let indexSave=0;
        const restoreSym = this.getReelIndex();
        for (let i = 0; i < this.symbols.length; i++) {
            if(restoreSym && i > 1){
                const savedName = restoreSym[indexSave];
                const frame = this.spriteSymbolsFrames.find(f => f?.name === savedName) ?? null;
                indexSave++;
                const sprite = this.symbols[i].getComponent(Sprite) || this.symbols[i].addComponent(Sprite);
                sprite.spriteFrame = frame;
            }
            else{
                const randomIndex = SymbolsRNG.randomSymbol();
                const sprite = this.symbols[i].getComponent(Sprite) || this.symbols[i].addComponent(Sprite);
                sprite.spriteFrame = this.spriteSymbolsFrames[randomIndex];
            }

        }
    }

    public reelStartMovement(cheat: number) {
        this.spinning = true;
        this.winSymbols = [];
        this.symbols.slice().reverse().forEach((symbol, index) => {
            this.moveSymbol(symbol, index, cheat)
        })
        this.scheduleOnce(() => {
            this.reelEndMovement();
        }, 4)
    }
    private reelEndMovement() {
        this.spinning = false;
        this.symbols.forEach(symbol => {
            TweenSystem.instance.ActionManager.removeAllActionsFromTarget(symbol);
        });
        this.stopSymbol();
        this.eventEndReel();
    }

    private stopSymbol(){
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

    private moveSymbol(symbol: Node, index: number, cheat: number) {
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
                    let spriteFrame: SpriteFrame;
                    if (cheat>0){
                        if(cheat==6){
                            const randomIndex = SymbolsRNG.randomBonus();
                            spriteFrame = this.spriteSymbolsFrames[randomIndex];
                        }
                        else{
                            spriteFrame = this.spriteSymbolsFrames[cheat];
                        }

                    }
                    else{
                        const randomIndex = SymbolsRNG.randomSymbol();
                        spriteFrame = this.spriteSymbolsFrames[randomIndex];
                    }
                    const sprite = symbol.getComponent(Sprite) || symbol.addComponent(Sprite);
                    sprite.spriteFrame = spriteFrame;
                    moveStep();
                })
                .start();
        }
        moveStep();
    }
}
