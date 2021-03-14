const { readdirSync } = require('fs');

module.exports = (client) => {
    const commands = readdirSync('./Commands/');

    for(const dir of commands){
        readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js')).forEach(file => {
            const command = require(`../Commands/${dir}/${file}`);
            if(!command.name) return;
            client.commands.set(command.name, command);
            console.log(`${file}: ✅`);
        })
    }
}