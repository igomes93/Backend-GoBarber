module.exports = { // Eu tive que refazer a migration appointment para alterar
    up: async(queryInterface, Sequelize) => {

        return queryInterface.createTable('appointments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false, // vamos criar esa migration para efetuarmos o armazenamento no banco de dados dos agendamentos efetuados com os prestadores de serviço

                autoIncrement: true, // devemos lembrar que as migrations são criações de tabelas no banco de dados
                primaryKey: true,
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE // criaremos  coluna date, que não poderá receber dados nulos(allowNull) de tipo data

            },
            user_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' }, // user_id será um relacionamento para sabermos a hora marcada do usuario com o prestador
                onDelete: 'CASCADE',
                onUpdate: 'SET NULL',
                allowNull: true,
            },
            provider_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' }, // relacionamento para sabermos qual prestador ira atender o usuario
                onDelete: 'CASCADE',
                onUpdate: 'SET NULL',
                allowNull: true,

            },
            canceled_at: {

                type: Sequelize.DATE // para sabermos a data que o usuario foi deletado

            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,

            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false


            },
        });

    },
    down: async(queryInterface) => {
        return queryInterface.dropTable('appointments');


    }
};
// agora vamos criar o model do appoitments
