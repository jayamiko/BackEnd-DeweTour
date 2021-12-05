const { transaction, trip, user, country } = require('../../models')
const Joi = require("joi")

exports.addTransaction = async (req, res) => {
    const schema = Joi.object({
        counterQty: Joi.number().required(),
        total: Joi.number().required(),
        tripId: Joi.number().required(),
        userId: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    // check if error return response 400
    if (error) {
        console.log(error);
        return res.status(400).send({
            status: "failed",
            error: {
                message: error.details[0].message,
            },
        });
    }

    try {
        const data = req.body;
        const { id } = req.user;

        const newTransaction = await transaction.create({
            ...data,
            userId: id,
            status: "Waiting Payment",
            attachment: null,
        });

        const transactionData = await transaction.findOne({
            where: {
                id: newTransaction.id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
                {
                    model: trip,
                    as: "trip",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "tripId"],
            },
        });
        res.send({
            status: "success",
            message: "Book succesfull added to your transaction",
            data: transactionData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        let data = await transaction.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status", "photo"],
                    },
                },
                {
                    model: trip,
                    as: "trip",
                    include: {
                        model: country,
                        as: "country",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "idCountry",
                            "description",
                            "image",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["updatedAt", "userId", "tripId"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        const newData = data.map((item) => {
            let attachment = item.attachment
                ? "http://localhost:5000/uploads/" + item.attachment
                : null;

            return {
                id: item.id,
                counterQty: item.counterQty,
                total: item.total,
                status: item.status,
                attachment: attachment,
                createdAt: item.createdAt,
                trip: item.trip,
                user: item.user,
            };
        });

        res.send({
            status: "success",
            data: newData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await transaction.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
                {
                    model: trip,
                    as: "trip",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["updatedAt", "userId", "tripId"],
            },
        });
        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};


exports.updatePay = async (req, res) => {
    const { id } = req.params;

    const data = {
        status: "Waiting Approve",
        attachment: req.files.attachment[0].filename,
    };

    try {
        await transaction.update(data, {
            where: {
                id
            }
        });

        updateData = await transaction.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"]
                    },
                },
                {
                    model: trip,
                    as: "trip",
                    include: {
                        model: country,
                        as: "country",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "idCountry",
                            "description",
                        ],
                    },
                },
            ],
        })
        res.send({
            status: "Success",
            data: updateData,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Update Failed"
        })
    }
}

exports.updateConfirmTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        await transaction.update(req.body, {
            where: {
                id
            },
        });

        const updatedData = await transaction.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
                {
                    model: trip,
                    as: "trip",
                    include: {
                        model: country,
                        as: "country",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "idCountry",
                            "description",
                            "quota",
                            "image",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["updatedAt", "userId", "tripId"],
            },
        })

        res.send({
            status: "success",
            data: updatedData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
}

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await transaction.destroy({
            where: {
                id
            }
        })
        res.send({
            status: "Success",
            message: "Deleted is Succesfully"
        })
    } catch (error) {
        res.status(500).send({
            status: "Success",
            message: "Deleted Failed"
        })
    }
}