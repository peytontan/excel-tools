require('dotenv').config()
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user_model")
const userValidators = require("./validators/user_validator")


const userControllers = {
    register: async (req, res) => {
        const data = req.body

        const validationResult = userValidators.register.validate(data) //validate the data that the user keyed in against the schema
        if (validationResult.error) {
            res.statusCode = 400

            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // search for any existing user with same email,
        // return err if so
        try {
            const user = await userModel.findOne({email: data.email})
            if (user) {
                res.statusCode = 400
                return res.json({
                    msg: "Email has been registered previously"
                })
            }
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "Failed to check for duplicates"
            })
        }

        // apply hashing algo (bcrypt) to the given password
        // -> pw hash -> goes into DB
        const hash = await bcrypt.hash(data.password, 10)

        // use user model to create a new user
        try {
            await userModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "Failed to create user"
            })
        }
        
        // return response
        res.json({
            msg: "User created successfully"
        })
    },
    login: async (req, res) => {
        const data = req.body

        const validationResult = userValidators.loginSchema.validate(data)
        
        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // find if user exists by the username (email)
        // -> not exists: return login error (status 400)

        let user = null

        try {
            user = await userModel.findOne({email: data.email})
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "Error occurred when fetching user"
            })
        }

        if (!user) {
            res.statusCode = 401
            return res.json({
                msg: "Login failed, please try again"
            })
        }

        // use bcrypt to compare given password against DB record
        // -> if failed: return status 401 (unauthorized)
        
        const validLogin = await bcrypt.compare(data.password, user.password)

        if (!validLogin) {
            res.statusCode = 401
            return res.json({
                msg: "Login failed, please try again"
            })
        }

        // generate JWT using an external lib
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.APP_KEY,
            {
                expiresIn: "10 days",
                audience: "FE",
                issuer: "BE",
                subject: user._id.toString(), // _id from Mongoose is type of ObjectID,
            }
        )

        // return response with JWT
        res.json({
            msg: 'Success',
            token: token,
        })
    },
}

module.exports = userControllers