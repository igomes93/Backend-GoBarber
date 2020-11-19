import express from 'express';
import path from 'path';
import routes from './routes';

import './database'; // faz parte da migration

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))) // serve para servir arquivos estaticos e são acessados diretamente pelo navegador sera uma url do arquivo do avatar
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
