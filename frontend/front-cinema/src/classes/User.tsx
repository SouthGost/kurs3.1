import React from 'react';
import {immerable} from "immer"

export default class User{
    [immerable] = true;
    private login: string;
    private password: string;

    public constructor(
        login: string,
        password: string,
    ){
        this.login = login;
        this.password = password;
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