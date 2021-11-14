const express = require('express')
const router = express.Router()
const { addUsers, getUser, getUsers, updateUser, updateUserById, deleteUser } = require('../controllers/user')
const { addCountry, getCountries, getCountry, updateCountry, deleteCountry } = require('../controllers/country')
const { addTrip, getTrips, getTrip, updateTrip, deleteTrip } = require('../controllers/trip')
const { addTransaction, updatePay, updateConfirmTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction } = require('../controllers/transaction')
const { register, login } = require('../controllers/auth');

// Middleware
const { auth, admin } = require('../middlewares/auth')
const { uploadsFile } = require('../middlewares/uploadsFile')

// Route User
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.post('/users', addUsers)
router.put('/user/:id', uploadsFile("photo"), updateUser)
router.delete('/user/:id', auth, admin, deleteUser)

// Route Countries
router.get('/countries', getCountries)
router.get('/country/:id', getCountry)
router.post('/countries', auth, admin, addCountry)
router.put('/countries/:id', auth, admin, updateCountry)
router.delete('/countries/:id', auth, admin, deleteCountry)

// Route Trips
router.get('/trips', getTrips)
router.get('/trip/:id', auth, getTrip)
router.post('/trip', uploadsFile("image"), addTrip)
router.put('/trip/:id', auth, admin, updateTrip)
router.delete('/trip/:id', auth, admin, deleteTrip)

// Route Transaction
router.get('/transactions', auth, getTransactions)
router.get('/transaction/:id', auth, getTransaction)
router.post('/transaction', auth, addTransaction)
router.put(
    "/transactions/pay/:id", auth,
    uploadsFile("attachment", "uploads/proofs"),
    updatePay
)
router.put(
    "/transactions/confirm/:id",
    auth,
    admin,
    updateConfirmTransaction
);
router.delete('/transaction/:id', auth, deleteTransaction)

// Route Auth
router.post('/login', login);
router.post('/register', register);

module.exports = router;