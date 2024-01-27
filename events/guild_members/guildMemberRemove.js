module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, message) {
        
            // Lorsqu'un membre quitte le serveur, on le supprime du fichier JSON

            function readXPFile() {
                try {
                    return JSON.parse(fs.readFileSync('././xp.json'));
                } catch (err) {
                    console.error('Erreur lors de la lecture du fichier xp.json :', err);
                    return null;
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