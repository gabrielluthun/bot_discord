const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'userinfo',
    category: 'users',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'Utiliser le menu contextuel de Discord!',
    examples: ['Utiliser le menu contextuel de Discord!'],
    type: 'USER',
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);

        console.log(member.user.createdTimestamp);
        
        const embed = new MessageEmbed()
            .setAuthor({name: `${member.user.tag} (${member.id})`, iconURL: member.user.bot ? 'https://cdn.discordapp.com/attachments/1120540209126322247/1123992501812985917/walle.jpg' : 'https://cdn.discordapp.com/attachments/1120540209126322247/1123992600714678354/1685890811467.jpg'})
            .setColor('#8e48f7')
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setImage(member.user.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Nom', value: `${member.displayName}`, inline: true},
                {name: 'Modérateur', value: `${member.kickable ? '🔴' : '🟢'}`, inline: true},
                {name: 'Bot', value: `${member.user.bot ? '🟢' : '🔴' }`, inline: true},
                {name: 'Roles', value: `${member.roles.cache.map(role => role).join(', ').replace(', @everyone', ' ')}`},
                {name: 'A créé son compte le ', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`},
                {name: 'A rejoint le serveur le ', value:`<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`}
            )
            

        interaction.reply({embeds: [embed]})
    }
};