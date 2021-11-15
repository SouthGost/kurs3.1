import User from "./User";

export default class Employee extends User{
    private fio: string;
    private position: string;

    public constructor(
        login: string,
        password: string,
        fio: string,
        position: string,
    ){
        super(login, password);
        this.fio = fio;
        this.position = position;
    }

    getFio():string {
        return this.fio;
    }

    getPosition():string {
        return this.position;
    }
}