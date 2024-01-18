const { MessageEmbed } = require("discord.js");
const { Client } = require("nekos-best.js");
const fetch = require('node-fetch')

const nekosBest = new Client();

module.exports = {
    name: 'highfive',
    category: 'interaction',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'highfive [@member]',
    examples: ['highfive @Shivii'],
    description: 'Faire un check a un utilisateur',
    async run(client, message, args) {
        const target = message.mentions.members.find(m => m.id);
        const response = await fetch('https://nekos.best/api/v2/highfive')
        const json = await response.json()
        const randomGif = await json.results[0].url

        if (!target) {
            const noArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} a fait un check à <@1123252102068703284>`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
    
            return message.reply({embeds: [noArgsEmbed]})
           } else {
            const ArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} a fait un check à ${target}`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
            return message.reply({embeds: [ArgsEmbed]})
           }
       
        
    },
    options: [
        {
            name: 'target',
            description: 'L\'utilisateur a highfive',
            type: 'USER',
            required: false,
        },
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember('target')
        const response = await fetch('https://nekos.best/api/v2/highfive')
        const json = await response.json()
        const randomGif = await json.results[0].url

        if (!target) {
            const noArgsEmbed = new MessageEmbed()
                .setDescription(`${interaction.user.username} a fait un check à <@1123252102068703284>`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
    
            return interaction.reply({embeds: [noArgsEmbed]})
           } else {
            const ArgsEmbed = new MessageEmbed()
                .setDescription(`${interaction.user.username} a fait un check à ${target}`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
            return interaction.reply({embeds: [ArgsEmbed]})
           }
       
        
    }
}