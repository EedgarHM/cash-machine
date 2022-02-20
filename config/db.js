const Sequelize = require('sequelize');

// Credenciales de acceso a la base de datos
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;



// Creamos la instancia de sequelize y agregamos los datos de conexion a la base de datos
const sequelize = new Sequelize('cashmachine','root' , 'root',{
    dialect: 'mysql',
    host: dbHost,
    port:dbPort, 
    operatorsAliases: 0,
    define: {
        timestamps: false
    },
    pool: {
        max:5,
        min:0,
        acquire:30000,
        idle: 10000
    }

});


module.exports = sequelize;