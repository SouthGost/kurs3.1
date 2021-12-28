import React from 'react';
import { Link } from "react-router-dom";
import { immerable } from "immer";
import IResUser from '../interfaces/IResUser';
import { Button, Typography } from 'antd';
const { Text } = Typography;

export default class User {
    [immerable] = true;
    protected login: string;
    protected password: string;

    public constructor(user: IResUser) {
        this.login = user.login;
        this.password = user.password;
    }

    public getPosition() {
        return "User";
    }

    getLogin(): string {
        return this.login;
    }

    protected getDefaultNavigation(elements: JSX.Element) {
        return (
            <>
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