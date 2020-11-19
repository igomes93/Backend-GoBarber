import Sequelize from 'sequelize';
import mongoose from 'mongoose'; // importando o mongoose para usarmos o banco de dados não relacional Mongodb

import User from '../app/models/User';

import databaseConfig from "../config/database";
import File from '../app/models/File'; // importamos essa rota que será referente ao upload do avatar do usuario
import Appointment from "../app/models/Appointment" // importamos essa rota que será referente ao appointemnet

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();

    }

    init() { // metdod para conseguirmos usar o sequelize na aplicação

        this.connection = new Sequelize(databaseConfig)

        models.map(model => model.init(this.connection));
        models.map(model => model.associate && model.associate(this.connection.models)); // map criado para associação das tabelas user e file
    }

    mongo() { // metodo para utlizarmos o mongoDb
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/gobarber', { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
        ); // estamos usnado assimpara conecatar a aplicação ao mongo db


    }

}

export default new Database();
