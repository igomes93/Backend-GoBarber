// a craiação dessa migration tem fundamento em adc uma coluna na tabela de usuario por isso possui algumas peculiaridades nos comandos

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.addColumn( // comando no qual iremos passar que desejamos adc uma coluna na tabela user
            'users',
            'avatar_id', // abaixo passaremso algumas informações para ela
            {
                type: Sequelize.INTEGER, // será interger pq vamos referencias o id da imagem
                references: { model: 'files', key: 'id' }, // em references passaremos uma chave estrangeira(foreign key-FK), passaremos no objeto, passando o nome da tabela dentro de model
                // passaremos todo id que irá referiar o avatar ao usuario
                onUpdate: 'CASCADE', // se for alterado ira acontecer a alteração na tabela de usuario
                onDelete: 'SET NULL',
                allowNull: true, // se um dia o arquivo for deletado na tabela de arquivos iremos deletar e setar com nulo
            });
    },

    down: async queryInterface => {
        return queryInterface.removeColumn('users', 'avatar_id');

    }
};
