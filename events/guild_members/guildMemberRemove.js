const fs = require('fs');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {
        
            // Lorsqu'un membre quitte le serveur, on le supprime du fichier JSON

            function readXPFile() {
                try {
                    return JSON.parse(fs.readFileSync('././xp.json'));
                } catch (err) {
                    console.error('Erreur lors de la lecture du fichier xp.json :', err);
                    return null;
                }
            }


            function writeXPFile() {
                try {
                    fs.writeFileSync('././xp.json', JSON.stringify(xp));
                } catch (err) {
                    console.error('Erreur lors de l\'écriture du fichier xp.json :', err);
                }
            } 
       
            let xp = readXPFile();
            if (!xp) return;


            let user = member.id;
            if (xp[user]) {
                delete xp[user];
                writeXPFile(xp);
            }
    }
}