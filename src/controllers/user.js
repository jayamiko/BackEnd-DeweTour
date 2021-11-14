const { user } = require('../../models');


exports.getUsers = async (req, res) => {
    const id = req.user
    try {
        let data = await user.findAll({
            attributes: {
                exclude: ["updatedAt", "createdAt", "password"]
            }
        })

        const dataUsers = []
        for (let i = 0; i < data.length; i++) {
            let j = {
                id: data[i].id,
                name: data[i].name,
                email: data[i].email,
                status: data[i].status,
                phone: data[i].phone,
                address: data[i].address,
                photo: "http://localhost:5000/uploads/" + data[i].photo
            }
            dataUsers.push(j)
        }

        res.send({
            status: "success",
            data: dataUsers
        })
    } catch (error) {
        console.log(error);
        res.status(500), send({
            status: "failed",
            message: "Server Error"
        })
    }
}

exports.getUser = async (req, res) => {
    // const { id } = req.params
    const { id } = req.user
    const { photo } = req.files
    try {
        let data = await user.findOne({
            ...req.body,
            photo: "http://localhost:5000/uploads/" + photo[0].filename
        }, {
            where: {
                id
            }
        })
        res.send({
            status: "success",
            data,
        })
    } catch (error) {
        console.log(error);
        res.status(500), send({
            status: "failed",
            message: "Server Error"
        })
    }
}

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
    const { id } = req.user
    const { photo } = req.files
    try {
        await user.update(
            {
                ...req.body,
                photo: "http://localhost:3000/uploads/" + photo[0].filename
            }, {
            where: {
                id
            }
        })

        res.send({
            status: "Success",
            message: "Update is Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500), send({
            status: "failed",
            message: "Server Error"
        })
    }
}

// exports.updateUserById = async (req, res) => {
//     try {
//         const { id } = req.params

//         await user.update({ ...req.body }, {
//             where: {
//                 id
//             }
//         })

//         res.send({
//             status: 'success',
//             message: `Update user id: ${id} finished`
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

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