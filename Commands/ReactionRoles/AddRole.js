module.exports = {
    name: 'addrole',
    category: 'ReactionRoles',
    description: 'Adds a reaction role to a message',
    usage: '<@role> <emote>',
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES', {checkAdmin: true, checkOwner: true})) {
            message.channel.send('You do not have permissions for this command.\nMissing permission: MANAGE_MESSAGES.');
            return;
        }

        if(args.length < 2){
            message.channel.send("Not enough arguments");
            return;
        }

        let msgToFollow, role, emote;
        if(message.reference){
            msgToFollow = message.reference.messageID;
        }else{
            message.channel.send("You must respond to the message you want to add this to");
            return;
        }
        
        if(message.mentions && message.mentions.roles){
            role = message.mentions.roles.first();
        }

        if(!role){
            message.channel.send("You must mention a role");
            return;
        }

        emote = args[1];

        const data = {
            messageID: msgToFollow,
            emojiID: emote,
            roleID: role.id
        }
        
        const msg = await message.channel.messages.fetch(msgToFollow);
        try{
            await client.reactionRoles.add(data);
            if(msg){
                msg.react(emote);
            }
        }catch(err){
            console.error(err);
            message.channel.send('Something went wrong, please try again later').then(m => m.delete({timeout: 5000})).catch(err => {});
        }
    }
}