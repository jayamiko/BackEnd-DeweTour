const { user } = require('../../models');
const fs = require("fs");

exports.getUsers = async (req, res) => {
    try {
        let data = await user.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        data = JSON.parse(JSON.stringify(data));
        const newData = data.map((item) => {
            const photo = item.photo
                ? "http://localhost:5000/uploads/" + item.photo
                : "http://localhost:5000/uploads/" + "no-photo.jpg";

            return {
                id: item.id,
                email: item.email,
                name: item.name,
                phone: item.phone,
                address: item.address,
                photo: photo,
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

exports.getUser = async (req, res) => {
    const { id } = req.params;

    try {
        let data = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        data = JSON.parse(JSON.stringify(data));
        const photo = data.photo
            ? "http://localhost:5000/uploads/" + data.photo
            : "http://localhost:5000/uploads/" + "no-photo.jpg";

        const newData = {
            ...data,
            photo: photo,
        };

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

exports.addUsers = async (req, res) => {
    try {
        await user.create(req.body)
        res.send({
            status: "success",
            message: "Add User Succesfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500), send({
            status: "Failed",
            message: "Server Error"
        })
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;

    const data = {
        photo: req.files.photo[0].filename,
    };

    try {
        const userData = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (userData.photo !== null) {
            fs.unlink("uploads/" + userData.photo, (err) => {
                if (err) throw err;
            });
        }

        await user.update(data, {
            where: {
                id,
            },
        });

        let updatedData = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        updatedData = JSON.parse(JSON.stringify(updatedData));
        const newUpdatedData = {
            ...updatedData,
            photo: "http://localhost:5000/uploads/" + updatedData.photo,
        };

        res.send({
            status: "success",
            data: {
                user: newUpdatedData,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        await user.destroy({
            where: {
                id
            }
        })
        res.send({
            status: "success",
            message: "Deleted Succesfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500), send({
            status: "Failed",
            message: "Deleted is Failed"
        })
    }
}