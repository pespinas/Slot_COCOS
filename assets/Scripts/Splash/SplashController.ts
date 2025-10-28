
import { _decorator, Component,UIOpacity,Node,tween} from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('SplashController')
export class SplashController extends Component {

    @property(Node)
    background: Node = null;

    start () {
        const opacity = this.background.getComponent(UIOpacity);
        tween(opacity)
            .to(3, {opacity: 255})
            .start();
    }
}
