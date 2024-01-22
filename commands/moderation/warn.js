const fs = require('fs');

module.exports = {
    name: 'warn',
    category: 'moderation',
    permissions: ['KICK_MEMBERS'],
    ownerOnly: false,
    usage: 'warn [@member] [reason]',
    examples: ['warn @Shivii spam'],
    description: 'Avertir un membre',
    options: [
        {
          name: "member",
          description: "L'ID de l'utilisateur à avertir",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "Indiquer la raison du warn",
          type: "STRING",
          required: true,
        },
      ],

    async runInteraction(client, interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString("reason");

        if (!member) return interaction.reply({
            content: 'Spécifier un membre à warn',
            ephemeral: true
        }); else {
            interaction.reply(`${member}, vous avez été warn pour la raison suivante: ${reason}`);
        }

        if (!reason) return interaction.reply({
            content: 'Spécifier une raison à votre warn',
            ephemeral: true
        });


        let warns = JSON.parse(fs.readFileSync('././warn.json'));

        if (!warns[member.id]) {
                warns[member.id] = { warn: 0, raison: [] };
        } else {
              warns[member.id].warn = warns[member.id].warn + 1;
                warns[member.id].raison.push(reason);
                fs.writeFileSync('././warn.json', JSON.stringify(warns));
        }  

        if (warns[member.id].warn === 3) {
            member.ban(reason);
            interaction.channel.send(`${member} a été banni pour la raison suivante: ${reason}`);
            delete warns[member.id];
            fs.writeFileSync('././warn.json', JSON.stringify(warns));
        }
    
    }
}
