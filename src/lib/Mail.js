import nodemeiler from 'nodemailer'; // lib responsavel pelo envio de email quando o usuario cancelar com o prestador de serviço
import exphbs from 'express-handlebars'; // responsavel pela configução do handlebars para o tamplete de e-mails enviado para o cancelamento de agendamento
import { resolve } from 'path'; // importamos o resolve do node para indicarmos onde estara os repositorios dos tamplates de e-mail
import nodemailerhbs from 'nodemailer-express-handlebars'; // responsavel pela configução do handlebars para o tamplete de e-mails enviado para o cancelamento de agendamento
import mailConfig from '../config/mail';



class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig; // desestruturação importada do config/mail
        this.transporter = nodemeiler.createTransport({ // o nodemailer usa essa variavel, quando o ele usa uma conexão com um serviço externo
            host,
            port,
            secure,
            auth: auth.user ? auth : null,

        });
        this.configureTamplates(); // chamamos esse metodo para o caminhos dos tamplates

    }

    configureTamplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); // vamos usar o resolve para navegar até a pasta e-mails

        this.transporter.use('compile', nodemailerhbs({ // use para adc uma configuração a mais, complie será a forma que compila o e-mails
            viewEngine: exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'), // configuração para chegarmos até a pasta layouts
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default', // configuração do layout do e-mail
                extname: '.hbs' // coniguração para informas a extensão dos arquivos utilizados no hadlebars
            }),
            viewPath,
            extName: '.hbs',

        }))
    }

    sendMail(message) { // será responsavel por envair o email
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message,

        });
    }
}

export default new Mail();
