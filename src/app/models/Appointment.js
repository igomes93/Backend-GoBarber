import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

// estamos criando o model de appointments quer será para a marcação do serviço
class Appointment extends Model {
    static init(sequelize) {
        super.init({
            date: Sequelize.DATE,
            canceled_at: Sequelize.DATE,
            past: {
                type: Sequelize.VIRTUAL, // vamos efetuar essa verificação para testarmos se data do lançamento é anterio a atual
                get() {
                    return isBefore(this.date, new Date()); // na listagem de agendamentos nos retornara agendamentos que ainda passaram ou não
                },
            },
            cancelable: {
                type: Sequelize.VIRTUAL,
                get() {
                    return isBefore(new Date(), subHours(this.date, 2)); // verifica se é cancelavel ou não, se estamos 2 horas antes do agendamento
                }

            }

        }, {
            sequelize,
        });
        return this;

    }

    static associate(models) { // comando para criação de relacionamentos com outra tabela,tem relacionamento com duas colunas da mesma tabela
            this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });

        } // agora vamos no index.js fazer importação
}


export default Appointment;
