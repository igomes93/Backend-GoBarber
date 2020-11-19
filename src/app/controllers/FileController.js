import File from '../models/File'; // importamos do model

class FileController {
    async store(req, res) { // tal codigo serve para passarmos para o banco de dados informações do arquivo de imagem que realizamos o upload
        const { originalname: name, filename: path } = req.file; // originalname é onome do arquivo na maquina do usuario

        const file = await File.create({
            name,
            path,
        });
        return res.json(file);
    }
}
export default new FileController();
// para o filecontroller guaradar as infomações, devemos criar uma tabela no banco de dados
// yarn sequelize migration:create --name=create-files
