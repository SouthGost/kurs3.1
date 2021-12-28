import ResPlaceCategory from "../interfaces/IResPlaceCategory";

export default class PlaceCategory {
    id: number;
    name: string;
    coefficient: number;

    public constructor(placeCategory: ResPlaceCategory) {
        this.id = placeCategory.id;
        this.name = placeCategory.name;
        this.coefficient = placeCategory.coefficient;
    }

    // public static async createCategory(id: number){
    //     const params = {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             place_category_id: id,
    //         }),
    //     };

    //     try {
    //         const response = await fetch(`http://localhost:8000/api/info/place_category`, params);
    //         if (response.ok) {
    //             const data = await response.json();
    //             return new PlaceCategory(data);
    //         } else {
    //             throw new Error("Не найдеа категория места");
    //         }
    //     } catch (err) {
    //         throw new Error("У нас проблемы. Подождите немного.");
    //     }
    // }

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
    }
}