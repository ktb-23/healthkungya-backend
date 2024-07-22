const authService = require('../services/auth.service');

const register = (req, res) => {
    const { id, password, nickname, weight } = req.body;

    authService.register(id, password, nickname, weight, (error, data) => {
        if (error) {
            res.status(500).send({
                message: error.message || "회원가입중 에러 발생"
            });
            return;
        }
        res.status(201).send(data);
        return
    });
};

const login = (req, res) => {
    const { id, password } = req.body;

    authService.login(id, password, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "로그인중 오류 발생"
            });
            return;
        }
        res.send(data);
        return
    });
};

module.exports={register,login}