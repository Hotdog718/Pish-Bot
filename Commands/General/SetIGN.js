module.exports = {
    name: 'setign',
    category: 'General',
    description: 'Updates/Sets In-Game Name',
    usage: '<newIGN>',
    permissions: [],
    run: async (client, message, args) => {
        const newIGN = args.join(' ');

        if(!newIGN){
            message.channel.send('You must profile an in-game name');
            return;
        }

        try{
            await client.profiles.updateIGN(newIGN, message.author.id);
            message.channel.send(`Set IGN to: ${newIGN}`);
        }catch(e){
            message.channel.send('Something went wrong, please try again later.');
            console.error(e);
        }
    }
}