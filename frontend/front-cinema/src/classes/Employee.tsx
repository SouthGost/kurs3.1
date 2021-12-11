import User from "./User";
import { Link } from "react-router-dom";
import IResEmployee from '../interfaces/IResEmployee';
import { Form, Input, Button, Card, notification, Typography } from 'antd';
const { Text } = Typography;

export default class Employee extends User {
    private name: string;
    private position: string;
    private surname: string;
    private patronymic: string;

    public constructor(employee: IResEmployee) {
        super(employee);//{login: employee.login, password:employee.password}
        this.name = employee.name;
        this.position = employee.position;
        this.surname = employee.surname;
        this.patronymic = employee.patronymic;
    }

    getFio(): string {
        return this.name;
    }

    getPosition() {
        return this.position;
    }

    getNavigation(): JSX.Element {
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