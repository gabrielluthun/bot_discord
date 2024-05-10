const { MessageEmbed } = require('discord.js');
const fs = require('fs');

// Fonction pour lire le solde de l'utilisateur
function getUserBalance(userId) {
    let currentUserBalance = JSON.parse(fs.readFileSync('balance.json'));
    return currentUserBalance[userId].solde;
}

// Fonction pour mettre à jour le solde de l'utilisateur
function updateUserBalance(userId, newBalance) {
    let currentUserBalance = JSON.parse(fs.readFileSync('balance.json'));
    currentUserBalance[userId].solde = newBalance;
    fs.writeFileSync('balance.json', JSON.stringify(currentUserBalance));
}

module.exports = {
    name: 'des',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'des',
    examples: ['des'],
    description: 'Jouez aux dès contre le bot.',
    async runInteraction(client, interaction) {

        // Lecture du solde de l'utilisateur
        let userBalance = getUserBalance(interaction.user.id);


        // Vérification du solde de l'utilisateur
        if (userBalance < 50) {
            let desError = new MessageEmbed()
                .setTitle('Jeu de dés')
                .setDescription('Désolé, vous n\'avez pas assez de pièces pour jouer. Le coût de participation est de 50 pièces. Utilisez la commande /daily pour en obtenir.')
                .setColor('RED');
            return interaction.reply({ embeds: [desError], ephemeral: true });
        }

        
        // Demande de la mise de l'utilisateur
        let embedMessage = new MessageEmbed()
            .setTitle('Jeu de dés')
            .setDescription('Indique ta mise juste ici (min. 50 pièces)')
            .setColor('BLUE');

        await interaction.channel.send({ embeds: [embedMessage] });

        // Crée un filtre pour les messages qui vérifie si l'auteur du message est l'utilisateur qui a lancé la commande
        const filterBet = m => m.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter: filterBet, max: 1, time: 60000 });
        const bet = parseInt(collected.first().content);

        // Vérification de la mise de l'utilisateur
        if (isNaN(bet) || bet < 50 || bet > userBalance) {
            let desBetError = new MessageEmbed()
                .setTitle('Jeu de dés')
                .setDescription('Veuillez réécrire la commande `/des`, puis entrer un nombre valide et suffisant.')
                .setColor('RED');
            return interaction.channel.send({ embeds: [desBetError], ephemeral: true });
        }

        // Déduction de la mise du solde de l'utilisateur
        updateUserBalance(interaction.user.id, userBalance - bet);

        // Générer un nombre aléatoire entre 1 et 6 pour le choix de l'utilisateur
        const userChoice = Math.floor(Math.random() * 6) + 1;

        // Générer un nombre aléatoire entre 1 et 6 pour le choix du bot
        const botChoice = Math.floor(Math.random() * 6) + 1;

        // Comparer les choix de l'utilisateur et du bot
        if (userChoice === botChoice) {
            let desDraw = new MessageEmbed()
                .setTitle('Jeu de dés')
                .setDescription(`Égalité ! Vous avez choisi ${userChoice} et le bot a choisi ${botChoice}. Vous récupérez votre mise de ${bet.toLocaleString('fr-FR')} pièces.`)
                .setColor('YELLOW');
                updateUserBalance(interaction.user.id, userBalance); 
            interaction.channel.send({ embeds: [desDraw], ephemeral: true });
        } else if (userChoice > botChoice) {
            let multiplier = Math.round((Math.random() * (2.5 - 1.5) + 1.5) * 100) / 100;
            let gain = Math.round(bet * multiplier);
            let desWin = new MessageEmbed()
                .setTitle('Jeu de dés')
                .setDescription(`Félicitations ! Vous avez choisi ${userChoice} et le bot a choisi ${botChoice}. Vous remportez ${gain.toLocaleString('fr-FR')} pièces (multiplicateur : x${multiplier}).`)
                .setColor('GREEN');
            updateUserBalance(interaction.user.id, userBalance + gain);
            interaction.channel.send({ embeds: [desWin], ephemeral: true });
        } else {
            let desLose = new MessageEmbed()
                .setTitle('Jeu de dés')
                .setDescription(`Dommage ! Vous avez choisi ${userChoice} et le bot a choisi ${botChoice}. Vous perdez votre mise de ${bet.toLocaleString('fr-FR')} pièces.`)
                .setColor('RED');
            interaction.channel.send({ embeds: [desLose], ephemeral: true });
        }

    }
};