import * as Yup from 'yup'; // importamos o yup para efetuar a validação de dados do usuario
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({ // o req.body é um objeto, por isso passamos esse metodo para a autenticação
            name: Yup.string().required(),
            email: Yup.string().email().required(), // nessa parte estamos definindo que os campos name,email e
            password: Yup.string().required().min(6) // e password são obrigatorias e a senha deve ter minimo de 6 digi

        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails!' }) // se bater com a autenticação vai passar
        }




        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {

            return res.status(400).json({ error: 'Usuario já existe!' });
        }



        const { id, name, email, provider } = await User.create(req.body);

        // campos apenas que quero que apreça no front-end

        return res.json({
            id,
            name,
            email,
            provider
        });

    }

    // para efetuar um update da senha inluiremos o email e a senha anterior(oldPassword)
    async update(req, res) {
        const schema = Yup.object().shape({ // faremos agora validação de dados para edição do usuario
            name: Yup.string(), // na edição do usuario não é obirgatorio a edição de name,email, por isso
            email: Yup.string().email(), // tiramos o required
            oldPassword: Yup.string().min(6), // para senha é obrigatorio caso o usuario estaja informando a senha antiga
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ), // when é uma validação condicional onde temos acesso a outro campos do yup, nessa função retornamos onde se nossa variavel oldpassaword estiver preenchida eu quero que o nosso field seja requarid
            confirmPassword: Yup.string().when('password', (password, field) => // fazendo a parte de uma confirmação de senh
                    password ? field.required().oneOf([Yup.ref('password')]) : field
                )
                // quando o password estiver preenchido, ele procura

        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails!' }) // se bater com a autenticação vai passar
        }
        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId); // usado para buscar o usuario pela primarykey

        if (email && email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            }); // VERIFICAÇÃO CASO O USUARIO ESTAJA MUDANDO DE E-MAIL

            if (userExists) {

                return res.status(400).json({ error: 'Usuario já existe!' });
            }
        }
        // VERIFICAÇÃO SE A SENHA ANTIGA BATE COM A QUE ELE JÁ TEM
        // verificamos apenas se o usuario QUISER trocar de senha incluindo 'oldPassword &&'
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name, provider } = await user.update(req.body); // atualizando o usuario no final
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController();
