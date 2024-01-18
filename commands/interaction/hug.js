const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: 'hug',
    category: 'interaction',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'hug [@member]',
    examples: ['hug @Shivii'],
    description: 'faire un câlin à un utilisateur',
    async run(client, message) {
        const args = message.content.split(' ');
        const user = args[1];
        const response = await fetch('https://nekos.best/api/v2/hug')
        const json = await response.json()
        const randomGif = await json.results[0].url

        if (!user) {
            const noArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} fait un calin à <@1123252102068703284>`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
    
            return message.reply({embeds: [noArgsEmbed]})
           } else {
            const ArgsEmbed = new MessageEmbed()
                .setDescription(`${message.member.displayName} fait un calin à  ${user}`)
                .setColor('RANDOM')
                .setImage(randomGif)
                .setTimestamp()
            return message.reply({embeds: [ArgsEmbed]})
           } 
    },
    
    async runInteraction(client, interaction) {

    }
}