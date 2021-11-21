import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './reducers/store';
import { setUser } from './reducers/userSlice';
import User from './classes/User';
import Employee from './classes/Employee';
import Admin from './blocks/Admin';
import Login from './blocks/Auth/Login';
import Sessions from './blocks/Sessions';
import { Form, Input, Button, Card, notification, Modal, Typography } from 'antd';
const { Title } = Typography;

export default function App() {
    const dispatch = useAppDispatch();
    //const [user, setUser] = useState<User>(useAppSelector(state => state.user)); 
    const user = useAppSelector(state => state.user.val);

    return (
        <div className="App">
            {user.getLogin() === "" ?
                <Login />
                :
                <>
                {user.getContent()}
                <Routes>
                    <Route path="/" element={<Sessions />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* <Route exact path="/users" component={Users} />
          <Route exact path="/guilds" component={Guilds} />
          <Route exact path="/guilds/:id" component={Guild} /> */}
                </Routes>
                </>
            }

        </div>
    );
};

