module.exports = (client) => {
    client.on('ready', () => {
        console.log(`${client.user.tag} is now online!`);
    })

    client.on('message', async (message) => {
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;

        const prefix = client.config.prefix;
        const MessageArray = message.content.split(' ');
        const commandName = MessageArray[0].slice(prefix.length);
        const args = MessageArray.slice(1);
        const command = client.commands.get(commandName);
        
        if(!message.content.startsWith(prefix) || !command) return;
        
        try{
            command.run(client, message, args);
        }catch(e){
            console.error(e);
        }
    });

    client.on('guildMemberAdd', async (member) => {
        const channel = member.guild.systemChannel;

        if(channel){
            channel.send(`Welcome ${member} to ${member.guild.name}! Make sure to read ${member.guild.rulesChannel ? member.guild.rulesChannel : 'the rules.'}`)
            .catch(err => console.error(err));
        }
    });

    client.on('guildMemberRemove', async (member) => {
        const channel = member.guild.systemChannel;

        if(channel){
            channel.send(`${member.user.tag} has left the server.`)
            .catch(err => console.error(err));
        }
    })

    client.on('messageReactionAdd', async (messageReaction, user) => {
        if(user.bot) return;

        const reactionRoles = await client.reactionRoles.fetch(messageReaction.message.id);
        if(!reactionRoles) return;
        const reactionRoleData = reactionRoles.get(messageReaction.emoji.name) || reactionRoles.get(`<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`);
        if(reactionRoleData){
            const guild = await messageReaction.message.guild;
            if(!guild) return;
            const role = await guild.roles.fetch(reactionRoleData.roleID);
            const guildMember = await guild.members.fetch(user.id);
            if(role && guildMember){
                guildMember.roles.add(role);
            }
        }
    });

    client.on('messageReactionRemove', async (messageReaction, user) => {
        if(user.bot) return;

        const reactionRoles = await client.reactionRoles.fetch(messageReaction.message.id);
        if(!reactionRoles) return;
        const reactionRoleData = reactionRoles.get(messageReaction.emoji.name) || reactionRoles.get(`<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`);
        if(reactionRoleData){
            const guild = await messageReaction.message.guild;
            if(!guild) return;
            const role = await guild.roles.fetch(reactionRoleData.roleID);
            const guildMember = await guild.members.fetch(user.id);
            if(role && guildMember){
                guildMember.roles.remove(role);
            }
        }
    });
}