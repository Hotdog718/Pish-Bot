module.exports = {
    name: 'setfc',
    category: 'General',
    description: 'Updates/Sets Friend Code',
    usage: '<newFC>',
    permissions: [],
    run: async (client, message, args) => {
        const newFC = args.join(' ');

        if(!newFC){
            message.channel.send('You must profile a friend code');
            return;
        }

        try{
            await client.profiles.updateFC(newFC, message.author.id);
            message.channel.send(`Set FC to: ${newFC}`);
        }catch(e){
            message.channel.send('Something went wrong, please try again later.');
            console.error(e);
        }
    }
}