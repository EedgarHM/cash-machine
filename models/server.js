const express = require('express');
const users = require('../routes/userRoutes');
const path = require('path');
//const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.pathUsers = '/';

        // Iniciar pug
        this.pug();

        // Lectura  y parseo del body
        this.app.use(express.json());

        //  Rutas de mi aplicacion
        this.routes();
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