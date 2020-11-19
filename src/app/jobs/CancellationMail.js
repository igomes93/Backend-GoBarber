import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt'
import Mail from '../../lib/Mail'; // importando essa clase , pois vamos precisar enviar e-mail

class CancellationMail {

    get key() {
        return 'CancellationMail'; // para cada job precisamos dessa chave
    }

    async handle({ data }) { // tarefa que vai executar quando for chamado o codigo de envio  | vamos copiar o codigo do AppointementController para dentro do método handle
        const { appointment } = data;

        await Mail.sendMail({
            to: `${appointment.provider.name} < ${appointment.provider.email}>`, // formato para escrever o remtente e o destinatario do e-mail // será para quem iremos enviar o email (prestador de serviço)
            subject: 'Agendamento cancelado',
            tamplate: 'cancellation', // faz parte do tamplate criado com o hbs, configuramos o tamplate para envio automatico do cancelamento do agentamento
            context: { // são todas as variveis que o tamplate esta esperando
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(parseISO(appointment.date), "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt, }), // usado na configuração da data do e-mail de cancelamento

            }, // vamos precisar do acesso as informações definidas no Mail. sendMail()


        });


    }

}

export default new CancellationMail();
