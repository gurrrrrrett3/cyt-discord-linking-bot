import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import Discord, { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import config from "../../config.json";

interface Command {
  data: {
    name: string;
    description: string;
  }
  execute: (interaction: Discord.CommandInteraction, ...args: any[]) => void;
}

export default class CommandHandler {
  public client: Discord.Client;
  public commands: Collection<string, Command> = new Collection();

  constructor(client: Discord.Client) {
    this.client = client;

    this.client.once("ready", async () => {
      const applicationId = this.client.application?.id ?? this.client.user?.id ?? "unknown";

      let commandsToDeploy: RESTPostAPIApplicationCommandsJSONBody[] = [];
      const commandFiles = fs
        .readdirSync(path.resolve("./dist/modules/bot/commands"))
        .filter((file) => file.endsWith(".js"));

      console.log(`Deploying ${commandFiles.length} commands`);

      for (const file of commandFiles) {
        const command: Command = require(`./commands/${file}`);
        this.commands.set(command.data.name, command);
        commandsToDeploy.push(command.data);
      }

      const rest = new REST({ version: "9" }).setToken(this.client.token ?? "");

      this.client.application?.commands.set([]);

      rest                                                                             //yes this looks stupid but it's so I can develop on my server
        .put(Routes.applicationGuildCommands(applicationId, this.client.user?.id == "874218421569593364" ? "909808939045113887" : config.SERVER_ID), {
          body: commandsToDeploy,
        })
        .then(() => {
          console.log(`${this.commands.size} commands deployed`);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.channel) return; // Ignore DM interactions
      if (!interaction.isCommand()) return; // Ignore non-command interactions
      if (interaction.replied) return; // Ignore interactions that have already been replied to

      const command = this.commands.get(interaction.commandName);
      command?.execute(interaction);
    });
  }
}
