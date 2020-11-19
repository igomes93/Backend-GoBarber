// irá fazer a verificação se o usuario estiver logado para o mesmo alterar seus dados
// no insomnia no metodo put =>beader
// importaremos esse codigo para route.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // biblioteca para poder usar async,await
import authConfig from '../../config/auth';
// importamos o segredo do token para descriptografar e ver se ele esta valido
export default async(req, res, next) => {
    const authHeader = req.headers.authorization;
    // se o Header não estiver dentro
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided!' });
    }
    // dividindo a header fazendo o retorno só do token, efetuando uma desestruturação do array
    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;

        return next();


    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });

    }
}
