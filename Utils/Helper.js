

module.exports = {
	toTitleCase: (word) => {
		//takes a string as an argument and returns a string (toTitleCase("hello") => returns "Hello")
		if(word.length === 0) return word;
		let wordArr = word.split(" ");
		for(let i = 0; i < wordArr.length; i++){
			wordArr[i] = wordArr[i].charAt(0).toUpperCase() + wordArr[i].substring(1).toLowerCase();
		}
		return wordArr.join(" ");
	},
	createListEmbed: (client, message, data, resultsPerPage, embedFunction) => {
		let index = 0;
		let maxPages = Math.ceil(data.length/resultsPerPage);

		message.channel.send(embedFunction(client, message, data, resultsPerPage, index))
		.then(msg => {
			let reactions = ["⬅", "➡", "⏹"];
			reactions.forEach(function(r, i){
				setTimeout(function(){
					msg.react(r);
				}, i*800)
			})

			//set filter to only let only set reactions and message author to respond
			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
			}

			//create reactionCollector
			const collector = msg.createReactionCollector(filter, {idle: 60000});

			collector.on('collect', async (reaction, user) => {
				const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
				try {
					for (const reaction of userReactions.values()) {
						await reaction.users.remove(message.author.id);
					}
				} catch (error) {
					console.error('Failed to remove reactions.');
				}
				switch(reaction.emoji.name){
					case '⬅':{
						index = (index-1) < 0? maxPages-1 :index-1;
						msg.edit(embedFunction(client, message, data, resultsPerPage, index));
						break;
					}
					case '➡':{
						index = (index+1)%maxPages;
						msg.edit(embedFunction(client, message, data, resultsPerPage, index));
						break;
					}
					case '⏹':{
						collector.emit('end');
						break;
					}
				}
			})

			collector.on('end', collected => {
				msg.delete().catch(() => {});
			})
		})
		.catch(() => {});
	},
	createMenuEmbed: (client, message, data, embedFunction) => {
		const { MessageCollector } = require('discord.js');
		let index = 0;
		let embed = embedFunction(client, index, data);
		message.channel.send(embed).then(msg => {
			let reactions = ["⬅", "➡", '⏹'];
			reactions.forEach(function(r, i){
				setTimeout(function(){
					msg.react(r);
				}, i*800)
			})

			//set filter to only let only set reactions and message author to respond
			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
			}

			//create Reaction Collector
			const collector = msg.createReactionCollector(filter, {idle: 60000});

			collector.on('collect', async(reaction, user) => {
				const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
				try {
					for (const reaction of userReactions.values()) {
						await reaction.users.remove(message.author.id);
					}
				} catch (error) {
					console.error('Failed to remove reactions.');
				}
				switch(reaction.emoji.name){
					case '⬅': {
						index = (index-1) < 0 ? data.length-1 : index-1;
						msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
						break;
					}
					case '➡': {
						index = (index+1)%data.length;
						msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
						break;
					}
					case '⏹': {
						collector.stop();
						break;
					}
					default: break;
				}
			})

			collector.on('end', collected => {
				msg.delete().catch(() => {});
			})
		})
		.catch(() => {});
	}
}
