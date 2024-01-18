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
        if(message.content.toLowerCase().startsWith('yo' || 'yoo' || 'yooo' || 'yoooo' || 'yooooo')) message.reply('plait');
        

        const prefix = '!'
        if (message.author.bot) return;

        message.content = message.content.toLowerCase();
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
}