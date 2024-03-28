const express = require('express');
const UserController = require('../controllers/userController')
const router = express();

require('../models')

router.get('/', (req, res) => {
    res.send("Hello")
})

router.get('/users', UserController.fetchUsers)
router.get('/insert', UserController.insertUsers)
router.put('/update/:id', UserController.updateUser);
router.get('/getbyid/:id', UserController.getUserById);
router.get('/delete/:id', UserController.deleteUser);
router.get('/register', UserController.insertLoginUser);
router.get('/login', UserController.checkLoginUser);

module.exports = router