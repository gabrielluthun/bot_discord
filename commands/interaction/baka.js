const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: 'baka',
    category: 'interaction',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'baka [@member]',
    examples: ['baka @Shivii'],
    description: 'Baka un utilisateur',
    async run(client, message, args) {
        const target = message.mentions.members.find(m => m.id);
        const response = await fetch('https://nekos.best/api/v2/baka')
        const json = await response.json()
        const randomGif = await json.results[0].url

        if (!target) {
            const noArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} dit à <@1123252102068703284> qu'il(elle) est idiot(e)`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
    
            return message.reply({embeds: [noArgsEmbed]})
           } else {
            const ArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} dit à ${target} qu'il(elle) est idiot(e)`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
            return message.reply({embeds: [ArgsEmbed]})
           }
       
        
    },
    options: [
        {
            name: 'target',
            description: 'L\'utilisateur a baka',
            type: 'USER',
            required: false,
        },
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember('target')
        const response = await fetch('https://nekos.best/api/v2/baka')
        const json = await response.json()
        const randomGif = await json.results[0].url

        if (!target) {
            const noArgsEmbed = new MessageEmbed()
                .setDescription(`${interaction.user.username} dit à <@1123252102068703284> qu'il(elle) est idiot(e)`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
    
            return interaction.reply({embeds: [noArgsEmbed]})
           } else {
            const ArgsEmbed = new MessageEmbed()
                .setDescription(`${interaction.user.username} dit à ${target} qu'il(elle) est idiot(e)`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
            return interaction.reply({embeds: [ArgsEmbed]})
           }
       
        
    }
}