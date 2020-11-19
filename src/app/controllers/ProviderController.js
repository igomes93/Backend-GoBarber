import User from '../models/User'; // devemos importar o model de usuarios, pois o fornecedor tb é usuario
import File from '../models/File'; // importamos o model de file, pois queremos rotrnar as infos do avatar do forncedor


class ProviderController {
    async index(req, res) { //  termos o metodo index que é usado paara listagem, pois tal controller será util para listagem de fornecedores
        const providers = await User.findAll({ // usando a sintax findAll iremos listar todos os tipos de usuarios e com isso vamos passar uma conição para o banco de dados que será um where
            where: { provider: true }, // estamos retornando todos os usuarios que são prestadores de serviço no banco
            attributes: ['id', 'name', 'email', 'avatar_id'], // quando testamos visualizamos informações desnecessarias, por isso o passamos para o array de attributes apenas informações que queremos visualizar
            include: [{
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url']
            }], // fazemos o include no file, pois queremos como resposta o relacionamento das infos do usuario com as infos de seu avatar
        });
        return res.json(providers);
    }

}

export default new ProviderController();
