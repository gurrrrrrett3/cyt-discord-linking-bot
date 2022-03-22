import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Discord from "discord.js";
import CodeManager from "../../data/codeManager";

const Command = {
  data: new SlashCommandBuilder()
    .setName("discord")
    .setDescription("Manages linking and un-linking of your discord account to your Minecraft account on CYT")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("link")
        .setDescription("Links your discord account to your Minecraft account")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("unlink")
        .setDescription("Un-links your discord account from your Minecraft account")
    ),

  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;
    const subcommand = options.getSubcommand();

    switch (subcommand) {
        case "link":
        
        const code = CodeManager.newCode(interaction.user);
        const embed = new Discord.MessageEmbed()
            .setTitle("Almost there...")
            .setDescription(`Please type \`/link ${code}\` in the chat to link your discord account to your Minecraft account`)
            .setColor("#0099ff")
            .setFooter({text: "This code will expire in 30 minutes"});

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

            break;
        case "unlink":

            break;
    }
  },
};
module.exports = Command;
