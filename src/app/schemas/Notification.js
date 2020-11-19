import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    // variavel para definirmos os campos principais
    content: {
        type: String, // campo content do tipo string e obrigatorio
        required: true
    },
    user: {
        type: Number,
        required: true
    },
    read: { // campo para saber se a notificação foi lida
        type: Boolean,
        required: true,
        default: false

    },
}, {
    timestamps: true,
});

// quando criamos um novo agendamento temos que notificar o prestador de serviço, com isso devemos ir no Controller Appointment controller para quando o agendamento for criado o prestador receber a notificação



export default mongoose.model('Notification', NotificationSchema);
