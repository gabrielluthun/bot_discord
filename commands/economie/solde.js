const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'solde',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'solde',
    examples: ['solde'],
    description: 'Consulte ton solde',
    async run(client, message, args) {
        // lire le fichier balance.json
        let balanceDataFromFile = fs.readFileSync('balance.json');
        let userBalanceData = JSON.parse(balanceDataFromFile);

        // Obtenir l'ID de l'utilisateur
        let currentUserId = message.author.id;

        // Vérifier si l'utilisateur existe dans le fichier balance.json
        if (userBalanceData[currentUserId]) {
            let currentUserBalance = userBalanceData[currentUserId].solde;

            let soldeDaily = new MessageEmbed() //Embed pour afficher le solde actuel
                .setColor('#00ff00') // Couleur verte
                .setTitle('Solde actuel')
                .setDescription(`:white_check_mark: Ton solde est de ${currentUserBalance} points.`);

            message.channel.send({ embeds: [soldeDaily] });

        } else {
            let soldeDailyError = new MessageEmbed()
            .setColor('#ff0000') // Couleur rouge
            .setTitle('Erreur de solde')
            .setDescription(`:x: Tu n'as pas encore de solde. Utilise la commande \`!daily\` pour te créer un solde, et récupérer ta récompense quotidienne.`);

            message.channel.send({ embeds: [soldeDailyError] });
        } 
    }
}
