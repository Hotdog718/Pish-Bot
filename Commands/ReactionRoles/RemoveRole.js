module.exports = {
    name: 'removerole',
    category: 'ReactionRoles',
    description: 'Removes a reaction role to a message',
    usage: '<emote>',
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES', {checkAdmin: true, checkOwner: true})) {
            message.channel.send('You do not have permissions for this command.\nMissing permission: MANAGE_MESSAGES.');
            return;
        }

        if(args.length < 1) {
            message.channel.send("Not enough arguments");
            return;
        }

        let msgToFollow, emote;
        if(message.reference){
            msgToFollow = message.reference.messageID;
        }else{
            return message.channel.send("You must respond to the message you want to add this to");
        }

        emote = args[0];
        
        await client.reactionRoles.remove(msgToFollow, emote);
        const msg = await message.channel.messages.fetch(msgToFollow);
        let reaction = msg.reactions.cache.find(reaction => reaction.emoji.name === emote || `<:${reaction.emoji.name}:${reaction.emoji.id}>` === emote);

        if(reaction){
            reaction.users.remove(client.user.id);
        }
    }
}