import multer from 'multer'; // importamos o multer
import crypto from 'crypto';
import { extname, resolve } from 'path'; // duas funções o extename retorna uma imagem, resolve para percorrer

export default { // obejto de configução de como o multer vai guardar nossas imagens, vamos gravar as imagens dentro dos arquivos de nossa aplicação
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destino dos nossos arquivose vamos passar o caminho
        filename: (req, file, cb) => { // formatar o nome de arqivo da imagem,tranformando cada imagem em aruivo unico
            crypto.randomBytes(16, (err, res) => { // 16 é onumero de bytes aleatorias err é o erro nda funçaõ e res o retorno,se deu tudo certo retornaremos o callback

                if (err) return cb(err);

                return cb(null, res.toString('hex') + extname(file.originalname)) // faz com que o nome do aruivo seja aletorio, pois os usuarios podem passar um arquivo de imagem com mesmo nome
            }); // acabando a configuração do multer vamos no arquivo route.js, para passarmos a rota
        },

    }),
};
