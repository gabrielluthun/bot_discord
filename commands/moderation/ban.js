module.exports = {
    name: 'ban',
    category: 'moderation',
    permissions: ['BAN_MEMBERS'],
    ownerOnly: false,
    usage: 'ban [@member] [reason]',
    examples: ['ban @Shivii raison'],
    description: 'Bannir un utilisateur avec une raison',
    async run(client, message, args) {
        if(!args[0]) return message.reply('Spécifier un member à ban')
        if(!args[1]) return message.reply('Specifier une raison a votre ban!')

        const target = message.mentions.members.find(m => m.id);
        const reason = args.slice(1).join(' ')

        if(!target.bannable) return message.reply('Ce membre n\'est pas bannisable par le bot');

        target.ban({ reason });
        message.channel.send(`Le member ${target} a été ban!`);
    },
    options: [
        {
            name: 'target',
            description: 'L\'utilisateur a ban',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Raison du ban',
            type: 'STRING',
            required: true,
        }
    ],
    async runInteraction(client, interaction) {

        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason')

        if(!target.kickable) return interaction.reply('Ce membre n\'est pas bannisable par le bot');

        target.ban({ reason });
        interaction.reply(`Le member ${target} a été ban!`);
    }
}