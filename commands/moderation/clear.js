module.exports = {
    //Pouvoir supprimer à la fois un certain nombre de messages d'un utilisateur spécifique, ou un certain nombres de messages
    
    name: 'clear',
    category: 'moderation',
    permissions: ['MANAGE_MESSAGES'],
    ownerOnly: false,
    usage: 'clear [number] [@member]',
    examples: ['clear 10 @Shivii'],
    description: 'Supprimer un certain nombre de messages',
    async run(client, message, args) {
        if(!args[0]) return message.reply('Spécifier un nombre de messages à supprimer')
        if(isNaN(args[0])) return message.reply('Spécifier un nombre valide')

        if(args[0] > 100) return message.reply('Vous ne pouvez pas supprimer plus de 100 messages à la fois')
        if(args[0] < 1) return message.reply('Vous devez supprimer au moins un message')

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages)

            message.channel.send(`**${args[0]}** messages ont été supprimés`)
        })
    },

    options: [
        {
            name: 'number',
            description: 'Nombre de messages à supprimer',
            type: 'INTEGER',
            required: true,
        },
        {
            name: 'target',
            description: 'Utilisateur dont les messages doivent être supprimés',
            type: 'USER',
            required: false,
        }
    ],

    async runInteraction(client, interaction) {
        const number = interaction.options.getInteger('number')
        const target = interaction.options.getMember('target')

        if(number > 100) return interaction.reply('Vous ne pouvez pas supprimer plus de 100 messages à la fois')
        if(number < 1) return interaction.reply('Vous devez supprimer au moins un message')

        if(target) {
            const filterBy = target.id;
            await interaction.channel.messages.fetch({limit: 100}).then(messages => { 
                messages = Array.from(messages.values()).filter(m => m.author.id === filterBy); 
                const toDelete = messages.slice(0, number).map(m => m.id); 
                interaction.channel.bulkDelete(toDelete);
                interaction.reply({content: `${number} message(s) supprimé(s) venant de l'utilisateur ${target}`, ephemeral: true});
            })

        } else if(number) {
            await interaction.channel.messages.fetch({limit: number}).then(messages => { 
                messages = Array.from(messages.values()); 
                const toDelete = messages.slice(0, number).map(m => m.id); 
                interaction.channel.bulkDelete(toDelete);
                interaction.reply({content: `${number} message(s) supprimé(s)`, ephemeral: true});
            })
          
        }

    }
}