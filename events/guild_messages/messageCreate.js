const ownerId = '371386482717622273';
const fs = require('fs');


module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {

        if (message.content.toLowerCase().includes('noice')) message.reply('fais pas le malin wola');
        if (message.content.toLowerCase().endsWith('quoi')) message.reply('feur');
        if (message.content.toLowerCase().includes('quoi')) message.reply('feur');
        if (message.content.toLowerCase().includes('tue')) message.reply('lipe');
        if (message.content.toLowerCase().endsWith('tue')) message.reply('lipe');
        if (message.content.toLowerCase().startsWith('yo' || 'yoo' || 'yooo' || 'yoooo' || 'yooooo')) message.reply('plait');


        const prefix = '!'
        if (message.author.bot) return;

        //message.content = message.content.toLowerCase();
        const list = ['pute', 'putain', 'merde', 'connard', 'connasse', 'fdp', 'enculé', 'merde', 'tg', 'ta gueule'];

        if (list.some(word => message.content.includes(word))) {

            message.delete();
            let warns = JSON.parse(fs.readFileSync('././warn.json'));
            let user = message.author.id



            if (!warns[user]) {
                message.author.send(`Tu viens d'être averti pour avoir dit un mot interdit ici (dernier warn avant ban) : ${message.content}`)
                warns[user] = {
                    pseudo: message.author.username,
                    warn: 1,
                    raison: [message.content]
                }
            } else if (warns[user].warn === 0) {
                message.author.send(`Tu viens d'être averti pour avoir dit un mot interdit ici (dernier warn avant ban) : ${message.content}`)
                warns[user].warn++;
                warns[user].raison.push(message.content);
            } else {
                message.author.send(`Tu viens d'être banni **définitivement** du serveur pour cause de mot interdit : ${message.content}`)
                warns[user].warn++;
                warns[user].raison.push(message.content);
                setTimeout(() => {
                    message.member.ban();
                }, 1000);
            }
            fs.writeFileSync('././warn.json', JSON.stringify(warns));
        }

        // Système d'XP et de niveaux (70-129)
        let xp = readXPFile();
        let user = message.author.id;
        let xpAdd = Math.floor(Math.random() * 3) + 2;
        // let xpAdd = Math.floor(Math.random() * 7) + 8; (ancien calcul)

        // Si l'utilisateur n'a pas encore d'XP, on lui en donne
        if (!xp[user]) {
            initializeXP(user, xp);
        } else { // Si l'utilisateur a déjà de l'XP, on lui en ajoute
            xp[user].xpCurrent += xpAdd;
            xp[user].xpTotalCurrent += xpAdd;
        }

        let level = xp[user].level;
        let xpMax = xp[user].xpMax;
        let xpCurrent = xp[user].xpCurrent;
        let nextLevel = xp[user].nextLevel;
        let xpTotal = xp[user].xpTotal;
        let xpTotalMax = xp[user].xpTotalMax;
        let xpTotalCurrent = xp[user].xpTotalCurrent;
        let nextLevelTotal = xp[user].nextLevelTotal;

        // Fonction pour initialiser les données d'XP d'un utilisateur

        function initializeXP(user, xp) {
            xp[user] = {
                level: 1,
                xpMax: 100,
                xpCurrent: 0,
                nextLevel: 150,
                xpTotal: 0,
                xpTotalMax: 100,
                xpTotalCurrent: 0,
                nextLevelTotal: 150
            }
        }

        // Fonction pour lire le fichier xp.json
        function readXPFile() {
            try {
                return JSON.parse(fs.readFileSync('././xp.json'));
            } catch (err) {
                console.error('Erreur lors de la lecture du fichier xp.json :', err);
                return null;
            }
        }

        // Fonction pour écrire dans le fichier xp.json
        function writeXPFile() {
            try {
                fs.writeFileSync('././xp.json', JSON.stringify(xp));
            } catch (err) {
                console.error('Erreur lors de l\'écriture du fichier xp.json :', err);
            }
        } 

        if (xpCurrent >= xpMax) { // Si l'utilisateur a assez d'XP pour passer au niveau supérieur
            xp[user].level++;
            level = xp[user].level; 
            xp[user].xpMax += 50;
            xp[user].xpCurrent = 0;
            xp[user].nextLevel += 50;
            xp[user].xpTotal += 50;
            xp[user].xpTotalMax += 50;
            xp[user].xpTotalCurrent = 0;
            xp[user].nextLevelTotal += 50;
            message.channel.send(`GG ${message.author} tu viens de passer au niveau ${level} !`);
        }

        writeXPFile(xp);



        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmdName = args.shift().toLowerCase();
        if (cmdName.length === 0) return;

        let cmd = client.commands.get(cmdName);
        if (!cmd) return message.reply("Cette commande n'existe pas!");

        if (cmd.ownerOnly) {
            if (message.author.id !== ownerId) return message.reply('La seule personne pouvant taper cette commande est Shivii');
        }

        if (!message.member.permissions.has([cmd.permissions])) return message.reply(`Vous n'avez pas les permissions requises pour taper cette commande! (\`${cmd.permissions.join(', ')}\`)`)

        if (cmd) cmd.run(client, message, args);
    }
};