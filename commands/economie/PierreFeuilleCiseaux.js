const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ppc',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'ppc',
    examples: ['ppc'],
    description: 'Joue à Pierre Feuille Ciseaux contre le bot',
    async run(client, message, args) {
        // Lecture du solde de l'utilisateur
        let currentUserBalance = JSON.parse(fs.readFileSync('balance.json'));
        let userBalance = currentUserBalance[message.author.id].solde;

        // Vérification du solde de l'utilisateur
        if (userBalance < 50) {
            let ppcError = new MessageEmbed()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription('Désolé, vous n\'avez pas assez de pièces pour jouer. Le coût de participation est de 50 pièces. Attendez d\'avoir plus de pièces pour jouer.')
                .setColor('RED');
            return message.channel.send({ embeds: [ppcError] });
        }

        // Demande de la mise de l'utilisateur
        message.channel.send("Combien de pièces voulez-vous parier ?");

        // Crée un filtre pour les messages qui vérifie si l'auteur du message est l'utilisateur qui a lancé la commande
        const filterBet = m => m.author.id === message.author.id;

        // Attend un message de l'utilisateur qui passe le filtre, avec un délai de 60 secondes
        const collected = await message.channel.awaitMessages({ filter: filterBet, max: 1, time: 60000 });

        // Convertit le contenu du premier message collecté en nombre entier pour obtenir la mise de l'utilisateur
        const bet = parseInt(collected.first().content);

        // Vérification de la mise de l'utilisateur
        if (isNaN(bet) || bet < 100 || bet > userBalance) {
            let ppcBetError = new MessageEmbed()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription('Veuillez réécrire la commande `!ppc`, puis entrer un nombre valide et suffisant.')
                .setColor('RED');
            return message.channel.send({ embeds: [ppcBetError] });
        }

        // Déduction de la mise du solde de l'utilisateur
        currentUserBalance[message.author.id].solde -= bet;
        fs.writeFileSync('balance.json', JSON.stringify(currentUserBalance));

        // Création du sondage pour le choix de l'utilisateur
        let ppcPoll = new MessageEmbed()
            .setTitle('Pierre Feuille Ciseaux')
            .setDescription('Choisissez votre coup en réagissant avec l\'émote correspondante:')
            .addField('Pierre', '✊', true)
            .addField('Feuille', '✋', true)
            .addField('Ciseaux', '✌️', true)
            .setColor('BLUE');
        let pollMessage = await message.channel.send({ embeds: [ppcPoll] });
        await pollMessage.react('✊');
        await pollMessage.react('✋');
        await pollMessage.react('✌️');

        // Attente du choix de l'utilisateur
        const filterChoice = (reaction, user) => ['✊', '✋', '✌️'].includes(reaction.emoji.name) && user.id === message.author.id;
        const userReaction = await pollMessage.awaitReactions({ filter: filterChoice, max: 1, time: 60000 });
        const userChoice = userReaction.first().emoji.name;

        // Mapping du choix de l'utilisateur
        const choixUtilisateur = userChoice === '✊' ? 'pierre' : userChoice === '✋' ? 'feuille' : 'ciseaux';

        // Choix du bot
        const options = ['pierre', 'feuille', 'ciseaux'];
        const botChoice = options[Math.floor(Math.random() * options.length)];

        // Détermination du gagnant
        const resultats = {
            'pierre': { 'pierre': 'égalité', 'feuille': 'bot', 'ciseaux': 'utilisateur' },
            'feuille': { 'pierre': 'utilisateur', 'feuille': 'égalité', 'ciseaux': 'bot' },
            'ciseaux': { 'pierre': 'bot', 'feuille': 'utilisateur', 'ciseaux': 'égalité' }
        };
        let gagnant = resultats[botChoice][choixUtilisateur];

        // Mise à jour du solde de l'utilisateur en fonction du résultat
        if (gagnant === 'utilisateur') {
            currentUserBalance[message.author.id].solde += bet * 1.2;
            fs.writeFileSync('balance.json', JSON.stringify(currentUserBalance));
            let ppcGagne = new MessageEmbed()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription(`Vous avez gagné ! Vous remportez ${bet * 1.2} pièces.`)
                .setColor('GREEN');
            message.channel.send({ embeds: [ppcGagne] });
        } else if (gagnant === 'bot') {
            let ppcPerdu = new MessageEmbed()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription(`Vous avez perdu ! Vous perdez ${bet} pièces.`)
                .setColor('RED');
            message.channel.send({ embeds: [ppcPerdu] });
        } else if (gagnant === 'égalité') {
            currentUserBalance[message.author.id].solde += bet;
            fs.writeFileSync('balance.json', JSON.stringify(currentUserBalance));
            let ppcEgalite = new MessageEmbed()
                .setTitle('Pierre Feuille Ciseaux')
                .setDescription(`C'est une égalité ! Vous récupérez votre mise de ${bet} pièces.`)
                .setColor('YELLOW');
            message.channel.send({ embeds: [ppcEgalite] });
        }
    }
};