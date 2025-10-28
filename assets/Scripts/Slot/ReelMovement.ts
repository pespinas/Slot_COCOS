import { _decorator, Component, Node, tween, Vec3,  TweenSystem, Sprite, SpriteFrame, macro} from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ReelMovement')
export class ReelMovement extends Component {

    private minY: number = -334;
    private maxY: number = 501;
    private duration: number = 1;
    private symbols: Node[] = [];
    @property([SpriteFrame])
    private spriteSymbolsFrames: SpriteFrame[] = [];
    private spinning: boolean = false;
    private visibleY = [-167,0,167,334,501];

    start () {
        this.symbols = this.node.children;
    }

    reelStartMovement() {
        this.spinning = true;
        this.symbols.slice().reverse().forEach((symbol, index) => {
            this.moveSymbol(symbol, index)
        })
        this.scheduleOnce(() => {
            this.reelEndMovement();
        }, 4)
    }

    reelEndMovement() {
        this.spinning = false;
        this.maxY = 501;
        this.symbols.forEach(symbol => {
            TweenSystem.instance.ActionManager.removeAllActionsFromTarget(symbol);
        });
        for (let i = 0; i < this.visibleY.length; i++) {
            let closestSymbol: Node | null = null;
            let minDistance = Infinity;

            for (const symbol of this.symbols) {
                const distance = Math.abs(symbol.position.y - this.visibleY[i]);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSymbol = symbol;
                }
            }
            if (closestSymbol) {
                tween(closestSymbol)
                    .to(0.4, { position: new Vec3(0, this.visibleY[i], 0) }, { easing: 'bounceOut' })
                    .start();
            }

        }
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
                    const randomIndex = Math.floor(Math.random() * 6);
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
