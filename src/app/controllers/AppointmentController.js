import * as Yup from 'yup'; // vamos utilizar o yup para fazer a validação
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns' // biblioteca que usamos para lidar com datas, vamos importar alguns metodos da biblioteca
import pt from 'date-fns/locale/pt'; // usamos esse modulo da biblioteca date-fns para coverter a data para portugues
import Appointment from '../models/Appointment'; // importaremo o model de appointmet e criaremos uma rota post no arquivo route.js
import User from '../models/User'; // importando o model de usuario
import File from '../models/File';
import Notification from '../schemas/Notification'; // estaremos importando o schema ligado ao mongo db para efeturamos a notificação do agendamento
import Queue from '../../lib/Queue'; // estamos importando a lib de e-mail quando o usuario cancelar o e-mail chegara ao prestador de serviço
// subustituimos a fila pelo e-mail
import CancellationMail from '../jobs/CancellationMail';
// importando o job de cancelamento
class AppointmentController {
    /*
    listagem dos agendamentos dos usuarios
    */
    async index(req, res) { // estamos usando o metodo index para fazermos a listagem dos agendamentos marcados dos usuarios
        const { page = 1 } = req.query; // estamos criando essa variavel para termos uma listagem de 20 registros de agendamentos por pagina


        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'], // vamos utilizar o order para ordenar os agendamentos
            attributes: ['id', 'date', 'past', 'cancelable'],
            limit: 20,
            offset: (page - 1) * 20, // estamos criando para paginção para aparecer 20 registros por pagina
            include: [{
                model: User,
                as: 'provider',
                attributes: ['id', 'name'], // estamos incluindo na listagem no agendamento informações do avatar e do usuario
                include: [{
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url']
                }]
            }]



        });
        return res.json(appointments)
    }

    async store(req, res) {
        const schema = Yup.object().shape({ // schema de validação utilizando o yup para validação
            provider_id: Yup.number().required(),
            date: Yup.date().required(), // required irá servir para solicitar esses dois campos para a validação

        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails' }); // verificação da validação, se não for valido as informações de provider_id e date  irá gerar um erro
        }
        const { provider_id, date } = req.body;

        // check if provider_id is a provider
        const isProvider = await User.findOne({ // checagem se é jum prestador de serviço
            where: { id: provider_id, provider: true }, // procurando apenas um provider true na tabela,
        });
        if (!isProvider) { // verificação do Isprovider
            return res.status(401).json({ error: 'You can only create appointments with providers' })
        }
        /*
        checando se data já passou
        */

        const hourStart = startOfHour(parseISO(date)); // variavel que representa a biblioteca para manipulação de datas, essa variavel convertera a hora de string para date
        // startOfHour com parseISO irá arredondar a hora

        if (isBefore(hourStart, new Date())) {
            return res.status(400).json({ error: 'Past dates are note permitedd' })
        } // verificação se esse hourstatrt esta antes da data atual , se passar quer dizer que a data utilizada já passou

        /*
        checando se o prestador ja tem marcado para aquele horario
        */

        // vamos agora verificar se o prestador já tem um agendamento para o mesmo horario

        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id, // verifica se o prestador esta com o hrario marcado
                canceled_at: null,
                date: hourStart,

            },
        });
        if (checkAvailability) {
            return res.status(400).json({ error: 'Appointment date is not available' });
        }


        // abaixo iremos criar o agendamento
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date, // hourStart,
        });

        // Notificação para quando o prestador receber uma nova marcação iremos expoertar o schema do notification.js
        const user = await User.findByPk(req.userId); // para pegarmos o nome do usuario que ira receber a notificação de agendamento
        const formattedDate = format( // usamos para formatar a data
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt },
        );
        await Notification.create({
            content: `Novo agendamento de ${user.name} para o dia ${formattedDate}`, // conteudo da notificação
            user: provider_id, // ${user.name} estamos pegando o nome do usuario no model de user

        });

        return res.json(appointment);
    }

    async delete(req, res) { // estamos usando o metodo delete para o usuario poder efetuar o cancelamento do agendamento com 2 horas de antecedência
        const appointment = await Appointment.findByPk(req.params.id, { // vamos buscar o agendamento pelo id
            include: [{
                    model: User, // vamos cria um include que será para enviarmos o e-mail com as informações do provider
                    as: 'provider',
                    attributes: ['name', 'email']

                },
                {
                    model: User,
                    as: 'user', // codigo incluido para incluir a varivel user no tamplate de e-mail
                    attributes: ['name']
                }

            ],
        });

        if (appointment.user_id !== req.userId) {
            return res.status(401).json({ error: 'You dont have permission to cancel appoitment' });
        } // estamos verificando se o id do usuaario é o mesmo que esta logado

        const dateWithsub = subHours(appointment.date, 2); // variavel para que o usuario so possa cancelar o agendamento com duas horas antes


        if (isBefore(dateWithsub, new Date())) { // verificação para que o usuario possa cancelar em até duas hotras antes
            return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance. ' })

        }
        appointment.canceled_at = new Date(); // setando nova data

        await appointment.save();

        // vamos configura o envio de e-mail depois do cancelamento, pois depois de cancelado o agendamento o e-mail deve chegar
        await Queue.add(CancellationMail.key, {
            appointment
        });




        return res.json(appointment);
    }
}

export default new AppointmentController();
