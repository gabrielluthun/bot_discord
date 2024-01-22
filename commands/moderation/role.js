const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roles',
    category: 'moderation',
    permissions: ['MANAGE_ROLES'],
    ownerOnly: false,
    usage: 'roles',
    examples: ['roles'],
    description: 'Crée un message pour que les utilisateurs puissent avoir des roles',
    async run(client, message, args) {
        //exemple embed ↷ Vos Demandes de mp 

        // mettre les reactions en dessous de l'embed et faire en sorte que quand on clique sur une reaction on a le role
        // et quand on clique sur une autre reaction on a plus le role


        const roles = message.guild.roles.cache.get('1173180682244206592')
        const roles2 = message.guild.roles.cache.get('1173180892844404746')
        const roles3 = message.guild.roles.cache.get('1173180800372592661')
        const embed = new MessageEmbed()

            .setTitle('Vos Demandes de mp')
            .setColor('WHITE')
            .setDescription(`ೃ•°\n
            ◦•✦──────────✦•◦\n
    \n
            1 ‧ ♡ . Mp ouvert\n
    \n
            2 ‧ ♡ ‧ Mp sur demande\n
    \n
            3 ‧ ♡ ‧ Mp Fermé\n
    \n
            ◦•✦──────────✦•◦`)
            .setFooter(`Demande de ${message.author.username}`)
            .setTimestamp()
        message.channel.send({ embeds: [embed] }).then(msg => {
            msg.react('1️⃣')
            msg.react('2️⃣')
            msg.react('3️⃣')
            const filter = (reaction, user) => {
                return ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

           msg.awaitReactions({ filter }) 
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '1️⃣') {
                        if (message.member.roles.cache.has(roles.id)) {
                            message.member.roles.remove(roles)
                            message.channel.send('Vous n\'avez plus le role 1️⃣')
                        } else {
                            message.member.roles.add(roles)
                            message.channel.send('Vous avez le role 1️⃣')
                        }
                    } else if (reaction.emoji.name === '2️⃣') {
                        if (message.member.roles.cache.has(roles2.id)) {
                            message.member.roles.remove(roles2)
                            message.channel.send('Vous n\'avez plus le role 2️⃣')
                        } else {
                            message.member.roles.add(roles2)
                            message.channel.send('Vous avez le role 2️⃣')
                        }
                    } else if (reaction.emoji.name === '3️⃣') {
                        if (message.member.roles.cache.has(roles3.id)) {
                            message.member.roles.remove(roles3)
                            message.channel.send('Vous n\'avez plus le role 3️⃣')
                        } else {
                            message.member.roles.add(roles3)
                            message.channel.send('Vous avez le role 3️⃣')
                        }
                    }
                })
                .catch(collected => {
                    message.reply('Vous n\'avez pas réagis au message');
                });
        }
        )
    },
    async runInteraction(client, interaction) {


        const roles = interaction.guild.roles.cache.get('1195761007411335330') //A changer
        const roles2 = interaction.guild.roles.cache.get('1199068560618696745') //A changer
        const roles3 = interaction.guild.roles.cache.get('1199068603065049158') //A changer
        // stocker le bot 
        // const bot = interaction.guild.members.cache.get(client.user.id)

        const embed = new MessageEmbed()

            .setTitle('Vos Demandes de mp')
            .setColor('WHITE')
            .setDescription(`ೃ•°\n
            ◦•✦──────────✦•◦\n
    
            1 ‧ ♡ . Mp ouvert\n
   
            2 ‧ ♡ ‧ Mp sur demande\n
   
            3 ‧ ♡ ‧ Mp Fermé\n
    
            ◦•✦──────────✦•◦`)
            .setTimestamp()
        const msg = await interaction.reply({ embeds: [embed], fetchReply: true })
        msg.react('1️⃣')
        msg.react('2️⃣')
        msg.react('3️⃣')
        const filter = (reaction) => {
            //Modifier le code, il faut que le bot ne puisse PAS réagir au message
            return ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name)
        };

        const collector = msg.createReactionCollector({ filter });

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '1️⃣' && !user.bot) {
                //verfi si l'utilisateur a le role ou pas
                const member = reaction.message.guild.members.cache.get(user.id);
                if (member.roles.cache.has(roles)) {
                    member.roles.remove(roles)
                    interaction.channel.send('Vous n\'avez plus le role 1️⃣')
                } else {
                    member.roles.add(roles)
                    interaction.channel.send('Vous avez le role 1️⃣')
                }
            } else if (reaction.emoji.name === '2️⃣'&& !user.bot) {
                const member = reaction.message.guild.members.cache.get(user.id);
                if (member.roles.cache.has(roles2)) {
                    member.roles.remove(roles2)
                    interaction.channel.send('Vous n\'avez plus le role 2️⃣')
                } else {
                    member.roles.add(roles2)
                    interaction.channel.send('Vous avez le role 2️⃣')
                }
            } else if (reaction.emoji.name === '3️⃣'&& !user.bot) {
                const member = reaction.message.guild.members.cache.get(user.id);
                if (member.roles.cache.has(roles3)) {
                    member.roles.remove(roles3)
                    interaction.channel.send('Vous n\'avez plus le role 3️⃣')
                } else {
                    member.roles.add(roles3)
                    interaction.channel.send('Vous avez le role 3️⃣')
                }
            }
        });
    }
}