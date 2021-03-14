const Discord = require('discord.js');
const ReactionRolesManager = require('./Database/ReactionRolesManager.js');
const ProfileManager = require('./Database/ProfileManager.js');

const client = new Discord.Client({
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
    ws: {
        intents: new Discord.Intents(Discord.Intents.ALL)
    },
    presence: {
		status: 'online',
		activity: {
			name: 'Use !help to view all commands'
		}
	}
});

client.config = require('./config.json');
client.helpers = require('./Utils/Helper.js');

client.commands = new Discord.Collection();

client.reactionRoles = new ReactionRolesManager(client);
client.profiles = new ProfileManager(client);

client.login(process.env.TOKEN).then(() => {
    const handlers = ["Commands.js", "Events.js"];
    handlers.forEach(handler => {
        require(`./Handlers/${handler}`)(client);
    })
});