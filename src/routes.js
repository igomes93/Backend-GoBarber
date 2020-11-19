import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer'; // importamo essa parte do multer para efetuar o uploads de arquivos

// import User from './app/models/User'; // faz parte da migration

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController'; // faz parte do SessionController.js
// para autenticação de usuários
import FileController from './app/controllers/FileController'; // rota do uploads de arquivo criada para passar infos desse arquivo para o bando de dados
import ProviderController from './app/controllers/ProviderController'; // rota do controller de listagem de fornecedores
import authMiddeleware from './app/middleware/auth'; // importado da middeleware que verifica se o usuarios esta logado
import AppointmentController from './app/controllers/AppointmentController'; // rota controller para marcação do serviço
import ScheduleController from './app/controllers/ScheduleController'; // rota do controller para lista os agendamenstos dos prestadores de serviço
import NotificationController from './app/controllers/NotificationController'; // rota importada do controller para fazermos a listagem de notificações que os prestadores de serviço possuem
import AvailableController from './app/controllers/AvailableController'; // rota que criamos para listagem dos horarios vagos dos prestadores de serviço

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store); // faz parte do SessionController.js, para autenticação de usuarios

routes.use(authMiddeleware); // como esse middeleware esta nesta posição só vale para as rotas abaixo dele

routes.put('/users', UserController.update); // esse é um tipo de rota que temos que criar uma middleware de autenticação para que o usuario não possa acessar enquanto não estiver logado
routes.get('/providers', ProviderController.index); // vamos criar essa rota para a listagem dos prestadores de serviço,vamos criar um novo controller,metodo index para listagem
routes.get('/appointments', AppointmentController.index); // vamos chamar essa rota para listarmos os agendamentos dos usuarios
routes.post('/appointments', AppointmentController.store); // rota para marcar serviços com os prestadores usando o metodo store
routes.get('/providers/:providerId/available', AvailableController.index) // rota que será usada para listar os horarios disponiveis do prestador de serviço
routes.post('/files', upload.single('file'), FileController.store); // rota para o uploads de imagem, single significa que vai uma imagem por vez
routes.delete('/appointments/:id', AppointmentController.delete); // rota para efetuarmos o cancelamento do agendamento pelo usuario
routes.get('/schedule', ScheduleController.index); // rota para listagem dos agendamentos dos presstarodes de serviço
routes.get('/notifications', NotificationController.index); // rota que será usadapara listagem das notificações dos prestadores de serviço
routes.put('/notifications/:id', NotificationController.update); // rota para marcarmos as notificações como lidas
// importamos a função para o contoller para FileController


export default routes;
