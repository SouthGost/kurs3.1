import User from "./User";
import { Link } from "react-router-dom";
import IResEmployee from '../interfaces/IResEmployee';
import { Button } from 'antd';

export default class Employee extends User {
    private name: string;
    private position: string;
    private surname: string;
    private patronymic: string;

    public constructor(employee: IResEmployee) {
        super(employee);
        this.name = employee.name;
        this.position = employee.position;
        this.surname = employee.surname;
        this.patronymic = employee.patronymic;
    }

    public getPosition() {
        return this.position;
    }

    public getNavigation(): JSX.Element {
        const elements = (
            <Link to="/admin">
                <Button>
                    Рабочая страница
                </Button>
            </Link>
        );
        return this.getDefaultNavigation(elements);
    }
}