const { log } = require("console");
const { Collector } = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member, message) {
        const verificationCodeChannelID = '1195760610848288788';
        const verificationRoleID = '1195761007411335330';
        const verificationCode = generateCode();
        const verificationChannel = member.guild.channels.cache.get(verificationCodeChannelID);
        let essais = 0;
        const verifInvit = member.guild.channels.cache.get('1201286472410599585');

        if (verificationChannel.type === 'GUILD_TEXT') {
            const verificationMessage = await verificationChannel.send(`Salut ${member} ! Bienvenue sur le serveur! Pour accéder au reste du serveur, voici le code de vérification à rentrer : ${verificationCode}`);

            const filter = (userMessage) => userMessage.author.id === member.id && userMessage.content === verificationCode;

            const collector = verificationChannel.createMessageCollector(filter, { time: 30000 });

            collector.on('collect', async (userMessage) => {
                const role = member.guild.roles.cache.get(verificationRoleID);

                if (userMessage.content === verificationCode && userMessage.author.id === member.id) {
                    member.roles.add(role);

                    // Créer un tableau pour stocker les messages à supprimer
                    const messagesToDelete = [userMessage, verificationMessage, await verificationChannel.send(`Félicitations ${member}, tu as accès au reste du serveur! Lis bien les règles et amuse toi bien!`)];



                    // Supprimer les messages après quelques secondes (par exemple, 10 secondes)
                    setTimeout(() => {
                        messagesToDelete.forEach((message) => {
                            message.delete();
                        });
                    }, 1000);

                    // Stopper le collecteur
                    collector.stop('verified');
                }

                else if (userMessage.content !== verificationCode && userMessage.author.id === member.id) {
                    const messagesToDelete = [userMessage, await verificationChannel.send(`Mauvais code <@${member.id}>, réessaye! Tu as encore ${2 - essais} essais.`)];
                    // Supprimer tous les messages dans le tableau
                    setTimeout(() => {
                        messagesToDelete.forEach((message) => {
                            message.delete();
                        });
                    }, 1000);

                    essais++;
                    if (essais === 3) {
                        const botMessage = await verificationChannel.send(`Tu as échoué trop de fois <@${member.id}>, tu es kick du serveur.`)
                        messagesToDelete.push(botMessage, verificationMessage);
                        member.kick();

                        // Supprimer tous les messages dans le tableau
                        setTimeout(() => {
                            messagesToDelete.forEach((message) => {
                                message.delete();
                            });
                        }, 1000);

                        //Stopper le collector
                        collector.stop();

                        return;
                    }
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    verificationChannel.send('Verification time expired. Please retry the verification process.');
                }
            });
        }


        function generateCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            for (let i = 0; i < 5; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return code;
        }

        // Lorsqu'un membre rejoint le serveur, on l'incrémente dans le fichier JSON et on lui donne l'accès au système de niveaux

        let xp = readXPFile();
        if (!xp || member.user.bot) return;

        let user = member.id;
        if (!xp[user]) {
            initializeXP(user, xp);
            writeXPFile(xp);
        } 
        

        function readXPFile() {
            try {
                return JSON.parse(fs.readFileSync('././xp.json'));
            } catch (err) {
                console.error('Erreur lors de la lecture du fichier xp.json :', err);
                return null;
            }

            function writeXPFile() {
                try {
                    fs.writeFileSync('././xp.json', JSON.stringify(xp));
                } catch (err) {
                    console.error('Erreur lors de l\'écriture du fichier xp.json :', err);
                }
            }
        }
  
        try {
            const guildInvites = await member.guild.invites.fetch();
            const invitations = client.invites[member.guild.id];
            client.invites[member.guild.id] = guildInvites;
            const invite = guildInvites.find(i => invitations.get(i.code).uses);

            // Vérifiez que 'invite' est défini
            if (invite) {
                const inviter = client.users.cache.get(invite.inviter.id);
                verifInvit.send(`${member.user.username} a été invité par ${inviter.username}`);
            } else {
                verifInvit.send(`Impossible de déterminer qui a invité ${member.user.username}`);
            }
        } catch (err) {
            console.error(err);
        }

    }
}
