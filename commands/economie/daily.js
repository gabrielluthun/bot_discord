const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'daily',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'daily',
    examples: ['daily'],
    description: 'Récupère ta récompense quotidienne.',
    async run(client, message, args) {
        // Lire le fichier balance.json
        let balances = JSON.parse(fs.readFileSync('balance.json'));
        //Je te laisse debug maintenant et si jamais pour faire en / c'est async runinteraction au lieu de run oublie pas que ta des commandes deja faites dans les autres dossier ;) 
        // Si l'utilisateur n'a pas encore de solde, initialiser à 0
        if (!balances[message.author.id]) {
            balances[message.author.id] = {
                id: message.author.id,
                solde: 0
            };
        }

        let daily = 500; // Montant de la récompense journalière
        let balance = balances[message.author.id].solde; // Solde actuel de l'utilisateur
        let dailyCooldown = 86400000; // Cooldown de 24 heures en millisecondes
        let lastDaily = balances[message.author.id].lastDaily; // Dernière fois que l'utilisateur a reçu la récompense journalière

        // Si l'utilisateur a déjà reçu sa récompense journalière et que le cooldown n'est pas encore terminé
        if (lastDaily !== null && dailyCooldown - (Date.now() - lastDaily) > 0) {
            let time = dailyCooldown - (Date.now() - lastDaily);
            let hours = Math.floor(time / 3600000);
            let minutes = Math.floor((time - hours * 3600000) / 60000);
            let seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);

            let embedDailyError = new MessageEmbed()
                .setColor('#ff0000') // Couleur rouge pour indiquer une erreur
                .setTitle('Récompense quotidienne déjà récupérée')
                .setDescription(`:x: Tu as déjà récupéré ta récompense quotidienne. Reviens dans ${hours}h ${minutes}m ${seconds}s.`);

            message.channel.send({ embeds: [embedDailyError] });
        } else {
            // Si l'utilisateur n'a pas encore reçu sa récompense journalière, ou si le cooldown est terminé
            balances[message.author.id].solde += daily; // Ajouter la récompense journalière au solde de l'utilisateur
            balances[message.author.id].lastDaily = Date.now(); // Mettre à jour la dernière fois que l'utilisateur a reçu la récompense journalière
            fs.writeFileSync('balance.json', JSON.stringify(balances)); // Écrire les nouvelles balances dans le fichier balance.json
            let embedDaily = new MessageEmbed()
                .setColor('#00ff00') // Couleur verte pour indiquer le succès
                .setTitle('Récompense quotidienne récupérée')
                .setDescription(`:white_check_mark: Tu as récupéré ta récompense quotidienne de ${daily} pièces.`);

            message.channel.send({ embeds: [embedDaily] });
        }
    }

};