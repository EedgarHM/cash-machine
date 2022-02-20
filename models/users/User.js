const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');

const db = require('../../config/db');
const { options } = require('../../routes/userRoutes');

// Creacion del modelo de usuario
const User = db.define('user',{
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    last_name: {
        type: Sequelize.STRING
    },
    number_credit: {
        type: Sequelize.BIGINT
    },
    number_debit :{
        type: Sequelize.BIGINT,
        
    },
    debit_balance: {
        type: INTEGER,
        defaultValue: 1000
    },
    credit_balance: {
        type:INTEGER,
        defaultValue: 1000
    },
    debit_cvv: {
        type: INTEGER,
    },
    credit_cvv: {
        type:INTEGER,
    }
});


module.exports = {
    User
}