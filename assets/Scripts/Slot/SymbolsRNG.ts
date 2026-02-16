
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolsRNG')
export class SymbolsRNG extends Component {


    private static probabilitiesSymbol:number[] = [30, 25, 20, 20, 10, 5];
    private static probabilitiesBonus:number[] = [70,30];

    start () {

    }
    static randomSymbol(){
        return randomIndexSymbol(this.probabilitiesSymbol);
    }
    static randomBonus(){
        let bonus = randomIndexSymbol(this.probabilitiesBonus);
        if(bonus==1) return 7;
        else return 6;
    }
}

function randomIndexSymbol(probailities:number[]){
    const ramdomValue = Math.floor(Math.random() * 100);
    let cum = 0;
    for (let i = 0; i < probailities.length; i++) {
        cum += probailities[i];
        if(ramdomValue < cum)
        {
            let index = i;
            return index;
        }
    }
    return 0;
}
