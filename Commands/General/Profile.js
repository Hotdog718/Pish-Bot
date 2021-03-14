const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    category: 'General',
    description: 'Displays profile information for a user',
    usage: '[@User]',
    permissions: [],
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.member;
        
        let profile = await client.profiles.fetch(member.user.id);

        const embed = new MessageEmbed()
        .setTitle(`${member.displayName}\'s Profile`)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(member.displayHexColor)
        .setFooter(`Joined ${member.joinedAt}`)
        .addField('Friend Code', profile && profile.fc ? profile.fc : 'Friend code not set, use !setfc <fc> to set your friend code.')
        .addField('In-Game Name', profile && profile.ign ? profile.ign : 'In-Game Name not set, use !setign <ign> to set your in-game name.');

        message.channel.send(embed);
    }
}