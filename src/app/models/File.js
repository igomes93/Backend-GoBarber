import Sequelize, { Model } from 'sequelize';


class File extends Model {
    static init(sequelize) {
        super.init({ // model do file, logo apos importaremos o file para o arquivo index.js, que esta dentro de Database
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    return `http://localhost:5000/files/${this.path}`; // referencia ao retorno dos usuarios que são fornecedores retornando a url do arquivo do avatar
                }
            }


        }, {
            sequelize,
        });
        return this;



    }
}


export default File;
