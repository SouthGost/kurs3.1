import User from "./User";
import { Link } from "react-router-dom";

export default class Employee extends User {
    private fio: string;
    private position: string;

    public constructor(
        login: string,
        password: string,
        fio: string,
        position: string,
    ) {
        super(login, password);
        this.fio = fio;
        this.position = position;
    }

    getFio(): string {
        return this.fio;
    }

    getPosition() {
        return this.position;
    }

    getContent(): JSX.Element {
        return (
            <>
                <Link to="/admin">
                    Админская
                </Link>
                <div>
                    {this.login}
                </div>
            </>
        );
    }
}