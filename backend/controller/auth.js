const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getEmployee(login) {
    const employee = await db.query(
        'SELECT * FROM employee where login = $1',
        [login]
    );
    return employee.rows[0];
}

async function getUser(login) {
    const user = await db.query(
        'SELECT * FROM public.user where login = $1',
        [login]
    );
    return user.rows[0];
}

class AuthController {
    // checkEmployee(login){
    //     const employee;
    //     async () => {
    //         employee = await db.query(
    //             'SELECT * FROM employee where login = $1',
    //             [login]
    //         );
    //     }
    //     if(employee.rows[0] === undefined){
    //         console.log('Пусто');
    //     } else {
    //         console.log('Есть');
    //     }
    //     return employee.rows[0];
    // }

    // async getEmployees(req, res) {
    //     const employees = await db.query('SELECT * FROM employee');
    //     res.json(employees.rows);
    // };

    async login(req, res) {
        const { login, password } = req.body;
        const employee = await getEmployee(login);
        if (employee == undefined) {
            const user = await getUser(login);
            if (user !== undefined) {
                console.log('Есть');
                console.log(password, user.password)
                if (await bcrypt.compare(password, user.password)) {
                    return res.json({
                        user: user,
                        token: jwt.sign(user, "key")
                    });
                }
            }
        } else {
            console.log('Есть');
            console.log(password, employee.password)

            if (await bcrypt.compare(password, employee.password)) {
                return res.json({
                    user: employee,
                    token: jwt.sign(employee, "key")
                });
            }
        }
        return res.sendStatus(400);
    };

    refresh(req, res) {
        const { token } = req.body;
        if (token === undefined) {
            return res.sendStatus(400);
        }
        try {
            const user = jwt.verify(token, 'key');
            return res.json({ user });
        } catch (e) {
            console.log(e.message);
            return res.sendStatus(400);
        }
    }

    async register(req, res) {
        const { login, password } = req.body;
        if (
            login !== undefined &&
            password !== undefined &&
            login !== "" &&
            password !== ""
        ) {
            const employee = await getEmployee(login);
            if (employee == undefined) {
                try {
                    const newUser = (await db.query(
                        'INSERT INTO public.user (login, password) values ($1, $2) RETURNING *',
                        [login, await bcrypt.hash(password, 10)]
                    )).rows[0];
                    return res.json({
                        user: newUser,
                        token: jwt.sign(newUser, "key")
                    });
                } catch (e) {

                }
            }
        }
        res.sendStatus(400);
    }

    async regEmployee(req, res) {
        const { login, password, position, name, surname, patronymic } = req.body;
        if (
            login !== undefined &&
            password !== undefined &&
            position !== undefined &&
            name !== undefined &&
            surname !== undefined &&
            login !== "" &&
            password !== "" &&
            position !== "" &&
            name !== "" &&
            surname !== ""
        ) {
            const user = await getUser(login);
            if (user === undefined) {
                try {
                    let newEmployee;
                    if(patronymic === undefined || patronymic === ""){
                        newEmployee = (await db.query(
                            'INSERT INTO employee (login, password, position, name, surname) values ($1, $2, $3, $4, $5) RETURNING *',
                            [login, await bcrypt.hash(password, 10), position, name, surname]
                        )).rows[0];
                    } else {
                        newEmployee = (await db.query(
                            'INSERT INTO employee (login, password, position, name, surname, patronymic) values ($1, $2, $3, $4, $5, $6) RETURNING *',
                            [login, await bcrypt.hash(password, 10), position, name, surname, patronymic]
                        )).rows[0];
                    }
                    return res.json({ newEmployee });
                } catch (e) {
                    console.log(e)
                }
            }
        }
        res.sendStatus(400);
    };

    // async updateEmployee(req, res){
    //     const {id, name, val} = req.body;
    //     const film = await db.query(
    //         'UPDATE test set name = $1, val = $2 where id = $3 RETURNING *',
    //         [name, val, id]
    //     );
    //     res.json(film.rows[0]);
    // };

    // async deleteEmployee(req, res){
    //     const {login} = req.body;
    //     console.log(login);
    //     const employee = await db.query(
    //         'SELECT * FROM employee where login = $1',
    //         [login]
    //     );
    //     if(employee.rows[0] === undefined){
    //         console.log('Пусто');
    //         return res.sendStatus(400);
    //     } 
    //     const deleteEmployee = await db.query(
    //         'DELETE FROM employee where login = $1',
    //         [login]
    //     );
    //     console.log(employee);
    //     res.json({
    //         message: "delete",
    //     });
    // };

};

module.exports = new AuthController();