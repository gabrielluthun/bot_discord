const Logger = require('../../utils/Logger')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.invites = {}; // Initialise client.invites

        let guildsCount = await client.guilds.fetch();
        let usersCount = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)

        Logger.client(`- prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs !\n`);

        client.user.setPresence({ activities: [{ name: 't\'espionner 👀', type: "PLAYING"}], status: 'dnd'});

        client.application.commands.set(client.commands.map(cmd => cmd));

        // Ajout du code pour le suivi des invitations
        client.guilds.cache.forEach(async g => {
            try {
                const guildInvites = await g.invites.fetch();
                client.invites[g.id] = guildInvites;
            } catch (err) {
                console.error(err);
            }
        });
    },
};