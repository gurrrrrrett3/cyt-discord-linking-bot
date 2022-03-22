import Dicord from 'discord.js';
import CommandHandler from './commandHandler';
export default class Bot {
    public Client: Dicord.Client;
    public CommandHandler: CommandHandler;
    constructor(client: Dicord.Client) {
        this.Client = client;
        this.CommandHandler = new CommandHandler(client);

        this.Client.on('ready', () => {
            console.log(`Logged in as ${this.Client.user?.tag}`);
        });
    }
    
}