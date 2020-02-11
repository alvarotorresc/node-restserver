const jwt = require('jsonwebtoken')


// ========================
//  Verify Token
// ========================

const verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid'
                }
            })
        }

        req.user = decoded.user;
        next();
    })
}

// ========================
//  Verify Admin Role
// ========================
const verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                message: 'User is not an admin'
            }
        })
    }


}

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valid'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
}

module.exports = {
    verifyToken, verifyAdminRole
}