export default class Place{
    private row:number;
    private number:number;
    private state:string;

    public constructor(
        row:number,
        number:number,
        state:string
    ){
        this.row = row;
        this.number = number;
        this.state = state;
    }

    getRow(){
        return this.row;
    }

    getNumber(){
        return this.number;
    }
}