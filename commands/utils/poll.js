const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'sondage',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'sondage [question]',
    examples: ['sondage Quelle heure est-il ?'],
    description: 'Poster votre sondage',
    async run(client, message, args) {
                var time = 10000;
        
                const embed = new MessageEmbed()
                    .setTitle('Petit sondage test')
                    .setColor('RANDOM')
                    .setDescription('Répondez à ce sondage avec les réactions ci-dessous, durée du sondage : ' + time / 1000 + ' secondes');
        
                const poll = await message.channel.send({ embeds: [embed] });
                await poll.react('👍');
                await poll.react('👎');
                await poll.react('🤷');
        
                const filter = (reaction) => reaction.emoji.name === '👍' || '👎' || '🤷';
        
                const collector = poll.createReactionCollector({ filter, time: time });
        
                collector.on('collect', (reaction, user) => {
                    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                });
        
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`);
                });
    },

    options: [
        {
            name: 'title',
            description: 'Taper le titre de votre sondage',
            type: 'STRING',
            require: true,
        },
        {
            name: 'content',
            description: 'Taper le contenu de votre sondage',
            type: 'STRING',
            require: true,
        },
    ],

  async runInteraction(client, interaction) {
        const pollTitle = interaction.options.getString('title');
        const pollContent = interaction.options.getString('content');

        const embed = new MessageEmbed()
            .setTitle(pollTitle)
            .setColor('RANDOM')
            .setDescription(pollContent)
            .setTimestamp()
            .setFooter({ text: `Nouveau sondage généré par ${interaction.user.tag} !`})

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true})
        poll.react('✅')
        poll.react('❌')

 }
};