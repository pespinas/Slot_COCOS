
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolsRNG')
export class SymbolsRNG extends Component {


    private static probabilities:number[] = [23, 23, 22, 16, 12, 4];
    private static ramdomValue: number;
    private static index: number;

    start () {

    }
    static randomSymbol(){
        this.ramdomValue = Math.floor(Math.random() * 100);
        let cum = 0;
        for (let i = 0; i < this.probabilities.length; i++) {
            cum += this.probabilities[i];
            if(this.ramdomValue < cum)
            {
                this.index = i;
                return this.index;
            }
       }
       return 0;
    }

}
