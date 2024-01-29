const fs = require('fs');
const { MessageEmbed } = require('discord.js');

function readXPFile() {
    try {
        return JSON.parse(fs.readFileSync('././xp.json'));
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier xp.json :', err);
        return null;
    }
}

module.exports = {
    name: 'lvl',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'level',
    examples: ['level @Shivii'],
    description: 'Voir les statistiques de quelqu\'un',
    async run(client, message, args) {
        let xp = readXPFile();
        let user = message.mentions.users.first() || message.author;
        let level = xp[user.id].level;
        let xpMax = xp[user.id].xpMax;
        let xpCurrent = xp[user.id].xpCurrent;
        let nextLevel = xp[user.id].nextLevel;
        let xpTotal = xp[user.id].xpTotal;
        let xpTotalMax = xp[user.id].xpTotalMax;
        let xpTotalCurrent = xp[user.id].xpTotalCurrent;
        let nextLevelTotal = xp[user.id].nextLevelTotal;
        let xpRemaining = xpMax - xpCurrent;

        if (!level || !xpCurrent || !xpMax || !xpTotalCurrent || !xpTotalMax) {
            console.error('Une ou plusieurs variables sont indéfinies ou vides');
            return;
        }

        const embed = new MessageEmbed()
            .setTitle('Statistiques de ' + user.username)
            .addField('Niveau', level.toString(), true)
            .addField('XP', xpCurrent.toString() + '/' + xpMax.toString(), true)
            .setFooter({ text: `Prochain niveau dans ${xpRemaining} XP`})
            .setColor('RANDOM');
        message.channel.send({ embeds: [embed] });
    },
    async runInteraction(client, interaction) { //Utilisation avec le préfix "!"
        let xp = readXPFile();
        let user = interaction.mentions.users.first() || message.author;
        let level = xp[user.id].level;
        let xpMax = xp[user.id].xpMax;
        let xpCurrent = xp[user.id].xpCurrent;
        let nextLevel = xp[user.id].nextLevel;
        let xpTotal = xp[user.id].xpTotal;
        let xpTotalMax = xp[user.id].xpTotalMax;
        let xpTotalCurrent = xp[user.id].xpTotalCurrent;
        let nextLevelTotal = xp[user.id].nextLevelTotal;
        let xpRemaining = xpMax - xpCurrent;


        if (!level || !xpCurrent || !xpMax || !xpTotalCurrent || !xpTotalMax) {
            console.error('Une ou plusieurs variables sont indéfinies ou vides');
            return;
        }
        const embed = new MessageEmbed()
            .setTitle('Statistiques de ' + user.username)
            .addField('Niveau', level.toString(), true)
            .addField('XP', xpCurrent.toString() + '/' + xpMax.toString(), true)
            .setFooter({ text: `Prochain niveau dans ${xpRemaining} XP`})
            .setColor('RANDOM');
        message.channel.send({ embeds: [embed] });
    },
    options: [
        {
            name: "member",
            description: "Voir les statistiques de quelqu'un",
            type: "USER",
            required: false,
        }
    ],
    async runInteraction(client, interaction) { //Utilisation avec le slash command
        let xp = readXPFile(); 
        let user = interaction.options.getMember('member') || interaction.member;
        let username = interaction.member.user.username || user.user.username;
        let level = xp[user.id].level;
        let xpMax = xp[user.id].xpMax;
        let xpCurrent = xp[user.id].xpCurrent;
        let nextLevel = xp[user.id].nextLevel;
        let xpTotal = xp[user.id].xpTotal;
        let xpTotalMax = xp[user.id].xpTotalMax;
        let xpTotalCurrent = xp[user.id].xpTotalCurrent;
        let nextLevelTotal = xp[user.id].nextLevelTotal;
        let xpRemaining = xpMax - xpCurrent;

        if (!level || !xpCurrent || !xpMax || !xpTotalCurrent || !xpTotalMax) {
            console.error('Une ou plusieurs variables sont indéfinies ou vides');
            return;
        }

        const embed = new MessageEmbed()
            .setTitle('Statistiques de ' + username)
            .addField('Niveau', level.toString(), true)
            .addField('XP', xpCurrent.toString() + '/' + xpMax.toString(), true)
            .setFooter({ text: `Prochain niveau dans ${xpRemaining} XP`})
            .setColor('RANDOM');
        interaction.reply({ embeds: [embed] });
    }
}