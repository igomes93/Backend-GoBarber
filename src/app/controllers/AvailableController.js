import { // importarmos esses dois metodos para listas as datas do inicio até o final do ida das 08:00 até 19:00
    startOfDay,
    endOfDay,
    setHours,
    format,
    setMinutes,
    setSeconds,
    isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment'; // importamos o model de Appointment para pegarmos informações dos agendamenrtos


class AvailableController {
    async index(req, res) {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Invalid date' }); // verificando se date existe
        }

        const searchDate = Number(date); // usado para o date ser em numeros//vamos listar as datas disponiveis no banco de dados para importarmos a partir daquela data

        const appointments = await Appointment.findAll({ // estamos buscando no banco de dados o id do provider e os campos de cancelamentos nulos para sebermos os horarios para listar como disponiveis
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
                },
            },
        });

        const schedule = [ // constante que para listarmos todos os horários que um prestador de serviço possui
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];
        // vamos agora cria a listagem de horarios disponiveis para o usuario

        const available = schedule.map(time => { // vamos mapear a variavel schedule para indetificarmos os horarios disponiveis
            const [hour, minute] = time.split(':');
            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute),
                0
            );

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available: isAfter(value, new Date()) &&
                    !appointments.find(a => format(a.date, 'HH:mm') === time), // retorna as datas disponiveis é o retorno do mapeamento verifica tbm se o horario esta aocupado
            };
        });

        return res.json(available);
    }
}

export default new AvailableController();
