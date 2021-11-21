const db = require('../db');
const jwt = require('jsonwebtoken');

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

    async regEmployee(req, res) {
        try {
            const { login, password, fio, position } = req.body;
            const employee = await getEmployee(login);
            if (employee !== undefined) {
                const message = "Такой работник существует";
                console.log(message);
                return res.send(400).json({ message });
            }
            const newEmployee = await db.query(
                'INSERT INTO employee (login, password, fio, position) values ($1, $2, $3, $4) RETURNING *',
                [login, password, fio, position]
            );
            res.json(newEmployee.rows[0]);
        } catch (e) {
            return res.send(400).json({ message: e });
        }
    };

    async getEmployees(req, res) {
        const employees = await db.query('SELECT * FROM employee');
        res.json(employees.rows);
    };

    async login(req, res) {
        const { login, password } = req.body;
        const employee = await getEmployee(login);
        if (employee == undefined) {
            const user = await getUser(login);
            if (user === undefined) {
                console.log('Пусто');
                return res.sendStatus(400);
            }
            console.log('Есть');
            if (user.password !== password) {
                return res.sendStatus(400);
            }
            return res.json({
                user: user,
                token: jwt.sign(user, "key")
            });
        } else {
            console.log('Есть');
            if (employee.password !== password) {
                return res.sendStatus(400);
            }
            res.json({
                user: employee,
                token: jwt.sign(employee, "key")
            });
        }
    };

    async refresh(req, res) {
        const { token } = req.body;
        if(token === undefined){
            return res.sendStatus(400);
        }
        const user = jwt.verify(token, 'key');
        res.json({user});
    }

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