const { Router } = require('express');
const { usuariosGet, 
        getTransact, 
        getWithdrawals,
        signUp, 
        newRecord, 
        cards,
        depositMoney,
        pay,
        accountStatus,
    } = require('../controllers/userController');

const router = Router();

router.get('/', usuariosGet);

router.get('/transactions',getTransact);


router.get('/cards:id', cards)

router.get('/signup', signUp)

router.post('/signup', newRecord)

// Accunt transactions
router.post('/withdrawals',getWithdrawals)
router.post('/deposit-money', depositMoney)
router.post('/pay', pay)
router.post('/account-status', accountStatus)

module.exports = router;