import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User'; // sessão de autenticação de usuários
import authConfig from '../../config/auth'; // importação da pasta auth para configs do token
// só podemos ter um método por controller
class SessionController {
    async store(req, res) { // vamos fazer uma validação de dados no SessionController
        const schema = Yup.object().shape({ // o req.body é um objeto, por isso passamos esse metodo para a autenticação
            email: Yup.string().email().required(), // nessa parte estamos definindo que os campos name,email e
            password: Yup.string().required() // e password são obrigatorias e a senha deve ter minimo de 6 digi

        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails!' }) // se bater com a autenticação vai passar
        }


        // pega o email e senha recebidas no corpo da requisição quando o user for se autenticar
        const { email, password } = req.body;

        // verificando o email, apenas procura pelo email cadastrado no banco,pois o e-mail do usuario é unico
        const user = await User.findOne({ where: { email } });

        // verificação da existencia do usuario
        if (!user) {
            return res.status(401).json({ error: 'User not found!' })
        }

        // verificação se a senha não estiver batendo
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match!' })

        }
        // vamos gerar o token com o metodo jwt, usando um token gerado com um texto seguro com expiração de 7 dias
        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expriresIn,

            }),
        });

    }
}
// terminado vamos incluir a rota no arquivo routes.js
export default new SessionController();
