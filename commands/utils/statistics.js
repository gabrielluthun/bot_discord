module.exports = {
    name: 'statistics',
    category: 'utils',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'statistics',
    examples: ['statistics'],
    description: 'Statistiques du serveur',

    async runInteraction(client, interaction) {

        let guild = client.guilds.cache.get('1195758369319960696');
        let allMembers = await guild.members.fetch();
        let members = allMembers.filter(member => !member.user.bot).size;
        let bots = allMembers.filter(member => member.user.bot).size;

        let boosts = guild.premiumSubscriptionCount;
        let channelMembers = guild.channels.cache.find(channel => channel.name === `Membres: ${members}`);
        let channelBots = guild.channels.cache.find(channel => channel.name === `Bots: ${bots}`);
        let channelBoosts = guild.channels.cache.find(channel => channel.name === `Boosts: ${boosts}`);

        if (!channelMembers) {
            guild.channels.create(`Membres: ${members}`, {
                type: 'GUILD_VOICE',

                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ['CONNECT']
                    }
                ]
            }).then(channel => {
                console.log(`Channel created with ID: ${channel.id}`);
            }).catch(console.error);

        }

        if (!channelBots) {

            guild.channels.create(`Bots: ${bots}`, {

                type: 'GUILD_VOICE',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ['CONNECT']
                    }
                ]
            }).then(channel => {
                console.log(`Channel created with ID: ${channel.id}`);
            }).catch(console.error);

        }

        if (!channelBoosts) {
            guild.channels.create(`Boosts: ${boosts}`, {

                type: 'GUILD_VOICE',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ['CONNECT']
                    }
                ]
            }).then(channel => {
                console.log(`Channel created with ID: ${channel.id}`);
            }).catch(console.error);

        }


        setInterval(() => {
            let guild = client.guilds.cache.get('1125193054601609316');
            if (!guild) return; // Si la guilde n'existe pas, arrêtez l'exécution ici
        
            let members = guild.members.cache.filter(member => !member.user.bot).size;
            let bots = guild.members.cache.filter(member => member.user.bot).size;
            let boosts = guild.premiumSubscriptionCount;
        
            // Trouver les canaux
            let channelMembers = guild.channels.cache.find(channel => channel.name.startsWith('Membres:'));
            let channelBots = guild.channels.cache.find(channel => channel.name.startsWith('Bots:'));
            let channelBoosts = guild.channels.cache.find(channel => channel.name.startsWith('Boosts:'));
        
            // Vérifier et mettre à jour le nom du canal si nécessaire
            if (channelMembers && channelMembers.name !== `Membres: ${members}`) {
                channelMembers.setName(`Membres: ${members}`);
            }
            if (channelBots && channelBots.name !== `Bots: ${bots}`) {
                channelBots.setName(`Bots: ${bots}`);
            }
            if (channelBoosts && channelBoosts.name !== `Boosts: ${boosts}`) {
                channelBoosts.setName(`Boosts: ${boosts}`);
            }
        }, 10000); 

    }
}

