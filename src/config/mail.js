export default { // eftuando as configurações do envio do e-mail quando um agendamento for cancelado, quem irá receber é o prestador de serviço
    host: 'smtp.mailtrap.io', // enviaremos o email atraves de smtp
    port: 2525,
    secure: false,
    auth: {
        user: 'e701616e2b0df8', // autenticação de usuario e senha
        pass: '8e0dde46a73fb3',
    },
    default: {
        from: 'Equipe GoBarber <noreply@gobarber.com>' // remetente padrão da mensagens
    }
}


// para tais configurções devemos usar tais serviços de e-mail, como por exemplo (Amazon SES,MailGun,Sparkpost)
// vamos utilizar o mailtrap, pois ele funciona para ambientes de desenvolvimento
