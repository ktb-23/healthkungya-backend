const authService = require('../services/auth.service');
// 유효성 검사 함수
const isValidId = (id) => {
    // 예: 아이디는 4~20자의 알파벳과 숫자만 허용
    const idRegex = /^[a-zA-Z0-9]{4,20}$/;
    return idRegex.test(id);
};

const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const isValidNickname = (nickname) => {
    return nickname.length <= 8;
};

// 아이디 중복 체크 컨트롤러
const checkDuplicateId = (req, res) => {
    const { id } = req.body;

    authService.checkDuplicateId(id, (error, data) => {
        if (error) {
            return res.status(409).send(error);
        }
        return res.status(200).send(data);
    });
};

// 닉네임 중복 체크 컨트롤러
const checkDuplicateNickname = (req, res) => {
    const { nickname } = req.body;

    authService.checkDuplicateNickname(nickname, (error, data) => {
        if (error) {
            return res.status(409).send(error);
        }
        return res.status(200).send(data);
    });
};

// 회원가입 컨트롤러
const register = (req, res) => {
    const { id, password, nickname, weight } = req.body;
    if (!isValidId(id)) {
        return res.status(400).send({ message: "아이디는 4~20자의 알파벳과 숫자만 허용" });
    }

    if (!isValidPassword(password)) {
        return res.status(400).send({ message: "비밀번호는 문자/숫자/기호를 사용하여 8자리 이상이여야합니다." });
    }

    if (!isValidNickname(nickname)) {
        return res.status(400).send({ message: "닉네임은 8자 이내여야합니다." });
    }

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

// 로그인 컨트롤러
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

module.exports={register,login, checkDuplicateId, checkDuplicateNickname}