const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getEmployee(login) {
    const employee = await db.query(
        'SELECT * FROM employee where login = $1 AND used = true',
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

    async login(req, res) {
        try {
            const { login, password } = req.body;
            const employee = await getEmployee(login);
            if (employee == undefined) {
                const user = await getUser(login);
                if (user !== undefined) {
                    if (await bcrypt.compare(password, user.password)) {
                        return res.json({
                            user: user,
                            token: jwt.sign(user, "key")
                        });
                    }
                }
            } else {
                if (await bcrypt.compare(password, employee.password)) {
                    return res.json({
                        user: employee,
                        token: jwt.sign(employee, "key")
                    });
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    };

    refresh(req, res) {
        try {
            const { token } = req.body;
            if (token === undefined) {
                throw new Error("Нет токена");
            }
            const user = jwt.verify(token, 'key');
            return res.json({ user });
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    }

    async register(req, res) {
        try {
            const { login, password } = req.body;
            if (
                login !== undefined &&
                password !== undefined &&
                login !== "" &&
                password !== ""
            ) {
                const employee = await getEmployee(login);
                if (employee == undefined) {
                    const newUser = (await db.query(
                        'INSERT INTO public.user (login, password) values ($1, $2) RETURNING *',
                        [login, await bcrypt.hash(password, 10)]
                    )).rows[0];
                    return res.json({
                        user: newUser,
                        token: jwt.sign(newUser, "key")
                    });
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    }

    async regEmployee(req, res) {
        try {
            const { login, password, position, name, surname, patronymic } = req.body;
            if (
                login !== undefined &&
                password !== undefined &&
                position !== undefined &&
                name !== undefined &&
                surname !== undefined &&
                patronymic !== undefined &&
                login !== "" &&
                password !== "" &&
                position !== "" &&
                name !== "" &&
                surname !== ""
            ) {
                const user = await getUser(login);
                if (user === undefined) {
                    const newEmployee = (await db.query(
                        'INSERT INTO employee (login, password, position, name, surname, patronymic, used) values ($1, $2, $3, $4, $5, $6, true) RETURNING *',
                        [login, await bcrypt.hash(password, 10), position, name, surname, patronymic]
                    )).rows[0];

                    return res.json({ newEmployee });
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return res.sendStatus(400);
    };

};

module.exports = new AuthController();