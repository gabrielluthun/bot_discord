const { MessageEmbed } = require('discord.js');

const fs = require('fs');

// Fonction pour écrire le résultat dans le fichier proba-roulette.json -> calcul de probabilités

const writeResult = (result) => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync('proba-roulette.json'));
    } catch (error) {
        data = {};
    }
    // Initialisation de chaque chiffre à zéro si ce n'est pas déjà fait
    for (let i = 0; i <= 9; i++) {
        if (!data[i]) {
            data[i] = 0;
        }
    }
    data[result]++;
    fs.writeFileSync('proba-roulette.json', JSON.stringify(data, null, 2));
};

const readBalance = () => {
    try {
        let balance = JSON.parse(fs.readFileSync('balance.json'));
        if (typeof balance !== 'object') throw new Error('Balance is not an object');
        return balance;
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier balance.json:', error);
        return {};
    }
};

const writeBalance = (balance) => {
    try {
        fs.writeFileSync('balance.json', JSON.stringify(balance, null, 2));
    } catch (error) {
        console.error('Erreur lors de l\'écriture du fichier balance.json:', error);
    }
};

const sendEmbed = async (interaction, title, description, color) => {
    let embed = new MessageEmbed().setTitle(title).setDescription(description).setColor(color);
    await interaction.channel.send({ embeds: [embed] });
};

module.exports = {
    name: 'roulette',
    category: 'economie',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'roulette',
    examples: ['roulette'],
    description: 'Joue à la roulette contre le bot',
    async runInteraction(client, interaction) {
        let balance = readBalance();
        if (!balance[interaction.user.id]) {
            balance[interaction.user.id] = { solde: 0 };
        }
        let userBalance = balance[interaction.user.id].solde;

        if (userBalance < 50) {
            return sendEmbed(interaction, 'Roulette', 'Désolé, vous n\'avez pas assez de pièces pour jouer. Le coût de participation est de 50 pièces. Attendez d\'avoir plus de pièces pour jouer.', 'RED');
        }

        await sendEmbed(interaction, 'Faites vos jeux, rien ne va plus', 'Indique ta mise juste ici  ! *(min. 50 pièces)*', 'BLUE');

        const filter = m => m.author.id === interaction.user.id;
        const bet = parseInt((await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })).first().content);

        if (isNaN(bet) || bet < 50 || bet > userBalance) {
            return sendEmbed(interaction, 'Roulette', 'Veuillez réécrire la commande `!roulette`, puis entrer un nombre valide et suffisant.', 'RED');
        }

        balance[interaction.user.id].solde -= bet;
        writeBalance(balance);

        await sendEmbed(interaction, 'Roulette', 'Choisis un nombre entre 0 et 9.', 'BLUE');

        const choice = parseInt((await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })).first().content);

        if (isNaN(choice) || choice < 0 || choice > 9) {
            sendEmbed(interaction, 'Roulette', 'Veuillez réécrire la commande `!roulette`, puis entrer un nombre valide entre 0 et 9.', 'RED');
            balance[interaction.user.id].solde += bet;
            writeBalance(balance);
            return;
        }

        let initialMessage = await interaction.channel.send("Le bot choisis son nombre...");
        let emojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let botChoice;

        for (let i = 0; i < 10; i++) {
            botChoice = Math.floor(Math.random() * emojis.length);
            await initialMessage.edit(`Le bot choisis son nombre... ${emojis[botChoice]}`);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        writeResult(botChoice); 
        //Inscription du résultat dans le fichier proba-roulette.json


        if (choice === botChoice) {
            let gain = bet * 10;
            balance[interaction.user.id].solde += gain;
            writeBalance(balance);
            return sendEmbed(interaction, 'Roulette', `Vous avez gagné ! Vous remportez ${gain.toLocaleString('fr-FR')} pièces (multiplicateur : x10). `, 'GREEN');
        } else if (Math.abs(choice - botChoice) <= 1) {
            let multiplier = Math.round((Math.random() * (2.5 - 1.5) + 1.5) * 100) / 100;
            let gain = Math.round(bet * multiplier);
            balance[interaction.user.id].solde += gain;
            writeBalance(balance);
            return sendEmbed(interaction, 'Roulette', `Vous étiez proche ! Vous remportez ${gain.toLocaleString('fr-FR')} pièces (multiplicateur : x${multiplier}).`, 'YELLOW');
        } else {
            return sendEmbed(interaction, 'Roulette', `Vous avez perdu ! Vous perdez ${bet.toLocaleString('fr-FR')} pièces.`, 'RED');
        }
    }
};