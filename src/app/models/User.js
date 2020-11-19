import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL, // nunca vai existir na base de dados, apenas virtual
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,

        }, {
            sequelize,
        });

        // criptografia para senha do usuário
        // trecho de codigos de ações baseadas no model
        this.addHook('beforeSave', async(user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);

            }
        });
        return this;
    }

    // abaixo vamos criar o relacionamento do models de user com o model de file,metodos estatico associete recebera todos os models da aplicação
    static associate(models) { // belongsto é um tipo de relacionamaneto que significa em peretence
            this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // referencia de um id de arquivo dentro da tabela
        } // as:'avatar' é um relacionamento com o Provider controler para listarmos apenas infos de file que nos interessa

    // faz a comparação da senha digitada pelo usuário com a senha do banco
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
