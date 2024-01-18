const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "unban",
  category: "moderation",
  permissions: ["BAN_MEMBERS"],
  ownerOnly: false,
  usage: "unban [@member_id]",
  examples: ["unban @member_id"],
  description: "Débannir un utilisateur avec son id",
  options: [
    {
      name: "memberid",
      description: "L'id de l'utilisateur à déban",
      type: "STRING",
      required: true,
    },
    {
      name: "reason",
      description: "La raison du déban",
      type: "STRING",
    },
  ],
  async runInteraction(client, interaction) {
    const member = interaction.options.getString("memberid");
    const reason = interaction.options.getString("reason") || "Aucune raison indiquée.";

    let warns = JSON.parse(fs.readFileSync('././warn.json'));

    warns[member].warn = 0;
    warns[member].raison = [];
    
    fs.writeFileSync('././warn.json', JSON.stringify(warns));
    

    if (!member)
      return interaction.reply({
        content: "L'id du membre n'a pas été trouvé!",
        ephemeral: true,
      });

    

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.member.displayName} (${interaction.member.id})`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("#5CFF9D")
      .setDescription(
        `**Membre**: \`${member}\`
      **Action**: Unban
      **Raison**: ${reason ? reason : ' '}`
      )
      .setTimestamp();

    await interaction.reply({
      content: `Le membre ${member} a été unban!`,
      embeds: [embed],
      ephemeral: true,
    });

    await interaction.guild.members.unban(member);
  },
};