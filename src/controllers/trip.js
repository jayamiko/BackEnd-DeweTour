const { trip, country } = require("../../models");

const fs = require("fs");
const Joi = require("joi");

exports.addTrip = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        idCountry: Joi.number().required(),
        accomodation: Joi.string().min(5),
        transportation: Joi.string().min(5),
        eat: Joi.string().min(5),
        day: Joi.number().required(),
        night: Joi.number().required(),
        dateTrip: Joi.date().required(),
        price: Joi.number().required(),
        quota: Joi.number().required(),
        description: Joi.string().min(10).max(1000),
    });

    const { error } = schema.validate(req.body);

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
        const arrayFilename = req.files.image.map((item) => item.filename);

        const newTrip = await trip.create({
            ...req.body,
            image: JSON.stringify(arrayFilename),
        });

        let tripData = await trip.findOne({
            where: {
                id: newTrip.id,
            },
            include: {
                model: country,
                as: "country",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "countryId"],
            },
        });

        tripData = JSON.parse(JSON.stringify(tripData));

        const newData = {
            ...tripData,
            image: JSON.parse(tripData.image).map((image, index) => ({
                id: index + 1,
                url: process.env.PATH_TRIP_IMAGES + image,
            })),
        };

        res.send({
            status: "success",
            message: "Trip successfully added",
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

exports.getTrips = async (req, res) => {
    try {
        let data = await trip.findAll({
            include: {
                model: country,
                as: "country",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idCountry"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        const newData = data.map((item) => ({
            id: item.id,
            title: item.title,
            country: item.country,
            price: item.price,
            quota: item.quota,
            day: item.day,
            night: item.night,
            accomodation: item.accomodation,
            eat: item.eat,
            transpotation: item.transpotation,
            dateTrip: item.dateTrip,
            image: JSON.parse(item.image).map((image, index) => ({
                id: index + 1,
                url: process.env.PATH_TRIP_IMAGES + image,
            })),
        }));

        res.send({
            status: "success",
            data: newData,
        });
    } catch (error) {
        console.log(error),
            res.status(500).send({
                status: "failed",
                message: "server error",
            });
    }
};

exports.getTrip = async (req, res) => {
    const { id } = req.params

    try {
        let data = await trip.findOne({
            where: {
                id
            }, include: {
                model: country,
                as: "country",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "countryId"],
            },
        })

        data = JSON.parse(JSON.stringify(data));

        const newData = {
            ...data,
            image: JSON.parse(data.image).map((image, index) => ({
                id: index + 1,
                url: process.env.PATH_TRIP_IMAGES + image,
            })),
        };
        res.send({
            status: "success",
            data: newData,
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error"
        })
    }
}

// exports.addTrip = async (req, res) => {
//     try {
//         const allTrip = await trip.findAll()
//         const isAlreadyExist = allTrip.find(field => req.body.title === field.title)

//         const { image } = req.files
//         const allImage = []
//         for (let img of image) {
//             allImage.push("http://localhost:5000/uploads/" + img.filename)
//         }

//         const imageFileToString = JSON.stringify(allImage)

//         if (isAlreadyExist) {
//             return res.status(400).send({
//                 status: "failed",
//                 message: "Trip name already exist"
//             })
//         }

//         const data = await trip.create({
//             ...req.body,
//             image: imageFileToString
//         })

//         res.send({
//             status: "success",
//             message: "Add trip finished",
//             data
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             status: "failed",
//             message: "Server error"
//         })
//     }
// }

exports.updateTrip = async (req, res) => {
    const { id } = req.params;
    const { image } = req.files
    try {
        await trip.update(
            ...req.body, {
            where: {
                id
            }
        })
        res.send({
            status: "Success",
            message: "Add Trip is Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Add Trip Failed"
        })
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        await trip.destroy({
            where: { id },
        });
        res.send({
            status: "success",
            message: `delete trip id ${id} success`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
};