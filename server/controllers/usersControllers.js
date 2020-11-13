const {User} = require('../models/index');
const {comparePass} = require('../helpers/bcryptjs');
const {generateToken} = require('../helpers/jwt');
const {OAuth2Client} = require('google-auth-library');

class UsersController {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const payload = await User.create({
                email,
                password
            });
            res.status(201).json({
                id: payload.id,
                email: payload.email
            });
        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({
                where: {email}
            });
            if (!user) {
                res.status(401).json({
                    msg: `Invalid Email/Password`
                });
            } else if(!comparePass(password, user.password)) {
                res.status(401).json({
                    msg: `Invalid Email/Password`
                });
            } else {
                const access_token = generateToken({
                    id: user.id,
                    email: user.email
                });
                res.status(200).json({access_token});
            }
        } catch (err) {
            next(err)
        }
    }
    static loginGoogle(req, res, next) {
        let {google_access_token} = req.body
        const client = new OAuth2Client(process.env.CLIENT_ID);
        let email = ''
        client.verifyIdToken({
            idToken: google_access_token,
            audience: process.env.CLIENT_ID
        })
        .then(ticket => {
            let payload = ticket.getPayload()
            email = payload.email
            return User.findOne({where: {email: payload.email}})
        })
        .then(user => {
            if (user) {
                return user;
            } else {
                let userObj = {
                    email,
                    password: process.env.SECRET
                }
                return User.create(userObj)
            }
        })
        .then(dataUser => {
            let access_token = generateToken({id: dataUser.id, email: dataUser.email})
            return res.status(200).json({id: dataUser.id, email: dataUser.email, access_token})
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = UsersController