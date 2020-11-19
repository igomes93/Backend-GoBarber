import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns'; // estaremo impostrando a biblioteca que faz manipulação de datas, usando dois modulos que conseguiremos visualizer a marcação no inicio de um dia ate o final do mesmo dia
import Appointment from '../models/Appointment'; // controller responsavel pela listagem dos agendamentos dos prestadores de serviço
import User from '../models/User';


class ScheduleController {
    async index(req, res) { // usando o metodo index para eftuar a listagem
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true } // verificação para sabermos se o usuario logado é um prestador de serviços
        }); // ele tera que ser provider true
        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' }) // caso não seja existira esse if para o sistema não deixar listar
        }

        const { date } = req.query; // nessa desestruturação usamos para listar o dia
        const parsedDate = parseISO(date); // variavel para efetuarmos a comparação do inicio e fim do dia

        const appointment = await Appointment.findAll({ // listagem do agendamentos
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)], // usamos esse modulo do sequelize para ele nos trazer o hoario de inicio do dia e o final dos agendamentos

                },
            },
            order: ['date'],

        });
        return res.json(appointment);
    }

}

export default new ScheduleController();
