export default class Film{
    private name: string;
    private ageLimit: string;
    private genre: string;
    private description: string;
    private posterUrl: string;

    public constructor(
        name: string, 
        ageLimit: string, 
        genre: string, 
        description:string, 
        posterUrl: string
    ){
        this.name = name;
        this.ageLimit = ageLimit;
        this.genre = genre;
        this.description = description;
        this.posterUrl = posterUrl;
    }

    getName():string {
        return this.name;
    }

    getAgeLimit():string {
        return this.ageLimit;
    }

    getGenre():string {
        return this.genre;
    }

    getDescription():string {
        return this.description;
    }

    getPosterUrl():string {
        return this.posterUrl;
    }
}