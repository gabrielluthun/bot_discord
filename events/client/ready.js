const Logger = require('../../utils/Logger')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        let guildsCount = await client.guilds.fetch();
        let usersCount = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)

        Logger.client(`- prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs !\n`);

        client.user.setPresence({ activities: [{ name: 't\'espionner 👀', type: "PLAYING"}], status: 'dnd'});

        client.application.commands.set(client.commands.map(cmd => cmd));
    },
    /* 
        client.once('ready', () => {
            let guildsCount = await client.guilds.fetch();
            let usersCount = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
            client.user.setPresence({ activities: [{ name: 'Lawl', type: "PLAYING"}], status: 'dnd'});
            Logger.client(`- prêt à être utilisé par ${client.users.cache.size} utilisateurs sur ${client.guilds.cache.size} serveurs !\n`);
        });
    */
};