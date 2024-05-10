const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'solde',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'solde [utilisateur]',
    examples: ['solde Utilisateur'],
    description: 'Consulte ton solde ou celui d\'un autre utilisateur.',
    options: [
        {
            name: 'utilisateur',
            type: 'USER',
            description: 'L\'utilisateur dont vous voulez consulter le solde',
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        // lire le fichier balance.json
        let balanceDataFromFile = fs.readFileSync('balance.json');
        let userBalanceData = JSON.parse(balanceDataFromFile);

        // Obtenir l'ID de l'utilisateur
        let currentUserId = interaction.user.id;

        // Si un utilisateur est mentionné, utiliser son ID à la place
        let currentUser;
        if (interaction.options.getUser('utilisateur')) {
            currentUserId = interaction.options.getUser('utilisateur').id;
            currentUser = interaction.options.getUser('utilisateur').username;
        } else {
            currentUser = interaction.user.username;
        }

        // Vérifier si l'utilisateur existe dans le fichier balance.json
        if (userBalanceData[currentUserId]) {
            let currentUserBalance = userBalanceData[currentUserId].solde;
            let formattedBalance = currentUserBalance.toLocaleString('fr-FR');

            let soldeEmbed = new MessageEmbed() //Embed pour afficher le solde actuel
                .setColor('#00ff00') // Couleur verte
                .setTitle('Solde actuel')
                .setDescription(`:white_check_mark: Le solde de ${currentUser} est de ${formattedBalance} pièces.`);

            interaction.reply({ embeds: [soldeEmbed] });

        } else {
            let soldeErrorEmbed = new MessageEmbed()
                .setColor('#ff0000') // Couleur rouge
                .setTitle('Erreur de solde')
                .setDescription(`:x: L'utilisateur ${currentUser} n'a pas encore de solde. Utilise la commande \`!daily\` pour créer un solde.`);

            interaction.reply({ embeds: [soldeErrorEmbed] });
        }
    }
};