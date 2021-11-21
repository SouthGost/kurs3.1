import User from "./User";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card, notification, Typography } from 'antd';
const { Text } = Typography;

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

    getNavigation(): JSX.Element {
        const elements = (
            <Link to="/admin">
                <Button>
                    Админская
                </Button>
            </Link>
        );
        return this.getDefaultNavigation(elements);
    }
}