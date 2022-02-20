const express = require('express');
const bodyParser = require('body-parser');

const users = require('../routes/userRoutes');
const path = require('path');
const db = require('../config/db');

// models
const UserModel = require('../models/users/User');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.pathUsers = '/';

        // Iniciar la conexion a la base de datos
        this.connectionDB()


        // Iniciar pug
        this.pug();

        // Lectura  y parseo del body
        //this.app.use(express.json());
        this.app.use(bodyParser.urlencoded({extended:true}))

        //  Rutas de mi aplicacion
        this.routes();
    }


    async connectionDB(){
        await db.sync()
    }
    pug(){
        this.app.set('view engine','pug');
        this.app.set('views', path.join(__dirname, '../views'));
    
        // Cargando archivos estaticos
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.pathUsers,users)
    }

    listen(){
        this.app.listen(this.port, () => console.log(`Server Ready on http://localhost:${this.port}`))
    }
}

module.exports = Server;