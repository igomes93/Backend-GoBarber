import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationContoller { // controller responsavel pela listagem de notificações que o prestador de serviço receberá.

    async index(req, res) {
        const isProvider = await User.findOne({ // checagem se é jum prestador de serviço
            where: { id: req.userId, provider: true }, // procurando apenas um provider true na tabela,
        });
        if (!isProvider) { // verificação do Isprovider
            return res.status(401).json({ error: 'Only provider can load notifications!' })
        }

        const notifications = await Notification.find({ // nesse caso como estaremo listando informações pelo mongoose vamos usar o metodo ' find', que faz a listagem de todas notificações
            user: req.userId,
        }).sort({ createdAt: 'desc' }).limit(20); // usamos o sort para ordernarmos pela data de creição da notificaão e limit para termos 20 notificações por paginação
        return res.json(notifications); // createdAt:'desc server para ordernar em forma descrescente
    }

    async update(req, res) {


        const notification = await Notification.findByIdAndUpdate( // metodo que encontramos um registro e atualizamos ele ao mesmo tempo e pegando as notificações pelo id unsando o mongoose
            req.params.id, { read: true }, { new: true } // estamos atualizando e retornando uma nova atualização da notificação
        );
        return res.json(notification);
    }
}

export default new NotificationContoller();
