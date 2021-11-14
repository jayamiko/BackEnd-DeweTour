const { user } = require('../../models')

const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(5),
        address: Joi.string().min(1),
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            error: { message: error.details[0].message }
        })
    }

    const allUser = await user.findAll()
    allUser.map(item => {
        if (req.body.name === item.name) {
            return res.status(400).send({
                status: "failed",
                message: "Name already exist"
            })
        }
    })

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const { name, email, phone, address } = req.body
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            status: "user"
        })

        const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: "success",
            data: {
                name: newUser.name,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                phone: newUser.phone,
                address: newUser.address,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Server error"
        })
    }
}

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            error: { message: error.details[0].message }
        })
    }

    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        })

        const isPassValid = await bcrypt.compare(req.body.password, userExist.password)

        if (!isPassValid) {
            return res.status(400).send({
                status: "Failed",
                message: "Credential is invalid"
            })
        }

        const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY)
        res.status(200).send({
            status: "Success",
            data: {
                name: userExist.name,
                email: userExist.email,
                status: userExist.status,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
    }
}