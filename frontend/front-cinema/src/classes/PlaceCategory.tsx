import ResPlaceCategory from "../interfaces/IResPlaceCategory";

export default class PlaceCategory {
    private id: number;
    private name: string;
    private coefficient: number;

    public constructor(placeCategory: ResPlaceCategory) {
        this.id = placeCategory.id;
        this.name = placeCategory.name;
        this.coefficient = placeCategory.coefficient;
    }

    public getName(){
        return this.name;
    }

    public getCoefficent(){
        return this.coefficient;
    }

    public getBGColor(state: string){
        switch(state){
            case "free":
                switch(this.name){
                    case "VIP":
                        return "GreenYellow";
                    case "Обычный":
                    default:
                        return "white";    
                }
            case "busy":   
                return "#FF6347";
            case "choosed":
                return "#FFD700"    
        }
        return "white"
    }
}