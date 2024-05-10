// Importation des modules nécessaires
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
    async runInteraction(client, interaction) {
        // Lecture du fichier balance.json et récupération des soldes des utilisateurs
        let balances = JSON.parse(fs.readFileSync('balance.json'));
        // Récupération du solde de l'utilisateur actuel ou initialisation à 0 si l'utilisateur n'a pas encore de solde
        let userBalance = balances[interaction.user.id] || { id: interaction.user.id, solde: 0, streak: 0, lastDaily: null };

        // Ajout du solde de l'utilisateur à l'objet balances si l'utilisateur n'a pas encore de solde
        if (!balances[interaction.user.id]) {
            balances[interaction.user.id] = userBalance;
        }
        // Calcul de la récompense quotidienne avec un bonus pour chaque jour consécutif
        let daily = 500 + 250 * userBalance.streak;
        // Durée du cooldown en millisecondes (24 heures)
        let dailyCooldown = 86400000;

        // Si l'utilisateur a déjà reçu sa récompense quotidienne et que le cooldown n'est pas encore terminé
        if (userBalance.lastDaily && dailyCooldown - (Date.now() - userBalance.lastDaily) > 0) {
            // Calcul du temps restant avant la fin du cooldown
            let time = dailyCooldown - (Date.now() - userBalance.lastDaily);
            let hours = Math.floor(time / 3600000);
            let minutes = Math.floor((time - hours * 3600000) / 60000);
            let seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);

            // Envoi d'un message à l'utilisateur pour lui indiquer qu'il a déjà reçu sa récompense quotidienne
            interaction.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Récompense quotidienne déjà récupérée')
                    .setDescription(`:x: Tu as déjà récupéré ta récompense quotidienne. Reviens dans ${hours}h ${minutes}m ${seconds}s.`)]
            });
        } else {
            // Si plus de 24 heures se sont écoulées depuis la dernière récompense quotidienne, réinitialisation de la série
            if (userBalance.lastDaily && Date.now() - userBalance.lastDaily > dailyCooldown) userBalance.streak = 0;

            // Mise à jour du solde de l'utilisateur, de la dernière récompense quotidienne et de la série
            userBalance.solde += daily;
            userBalance.lastDaily = Date.now();
            userBalance.streak += 1;

            // Enregistrement des nouvelles balances dans le fichier balance.json
            fs.writeFileSync('balance.json', JSON.stringify(balances));

            // Envoi d'un message à l'utilisateur pour lui indiquer qu'il a reçu sa récompense quotidienne
            interaction.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('Récompense quotidienne récupérée')
                    .setDescription(`:white_check_mark: Tu as récupéré ta récompense quotidienne de ${daily.toLocaleString()} pièces.
                    *Nombre de jours consécutifs : ${userBalance.streak}.*`)]
            });

            // Si l'utilisateur a atteint une série de 5, 10 ou 30 jours consécutifs, il reçoit un bonus
            if ([5, 10, 20, 30, 50, 75, 100].includes(userBalance.streak)) {
                let bonus = userBalance.streak * 5000;
                userBalance.solde += bonus;
                // Enregistrement des nouvelles balances dans le fichier balance.json après l'ajout du bonus
                fs.writeFileSync('balance.json', JSON.stringify(balances));
                // Envoi d'un message à l'utilisateur pour lui indiquer qu'il a reçu un bonus
                interaction.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('Bonus de série quotidienne')
                        .setDescription(`:tada: Félicitations ! Tu as atteint une série de ${userBalance.streak} jours consécutifs. Tu reçois un bonus de ${bonus.toLocaleString()} pièces (en plus des ${daily.toLocaleString()} pièces, évidemment) !`)]
                });
            }
        }
    }
};