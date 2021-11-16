import React from 'react';
import {immerable} from "immer"

export default class User{
    [immerable] = true;
    protected login: string;
    protected password: string;

    public constructor(
        login: string,
        password: string,
    ){
        this.login = login;
        this.password = password;
    }

    getPosition() {
        return "User";
    }

    getLogin(): string {
        return this.login;
    }

    getContent(): JSX.Element {
        return (
            <div>
                {this.login}
            </div>
        );
    }
}