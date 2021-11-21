import React from 'react';
import { Link } from "react-router-dom";
import { immerable } from "immer";
import { Form, Input, Button, Card, notification, Typography } from 'antd';
const { Text } = Typography;

export default class User {
    [immerable] = true;
    protected login: string;
    protected password: string;

    public constructor(
        login: string,
        password: string,
    ) {
        this.login = login;
        this.password = password;
    }

    getPosition() {
        return "User";
    }

    getLogin(): string {
        return this.login;
    }

    protected getDefaultNavigation(elements: JSX.Element) {

        return (
            <>
                <Link to="/">
                    <Button>
                        Главная
                    </Button>
                </Link>
                {elements}
                <Button>
                    {this.login}
                </Button>
            </>
        );
    }

    getNavigation(): JSX.Element {
        return this.getDefaultNavigation(<></>);
    }
}