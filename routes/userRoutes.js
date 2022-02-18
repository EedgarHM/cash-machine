const { Router } = require('express');
const { usuariosGet, getTransact, signIn, newRecord } = require('../controllers/userController');

const router = Router();

router.get('/', usuariosGet);

router.get('/transacciones',getTransact);

router.get('/sign-in', signIn)
router.post('/sign-in', newRecord)


module.exports = router;