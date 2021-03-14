const { Client, Collection } = require('discord.js');
const ReactionRoleSchema = require('./Schemas/ReactionRolesSchema.js');
const mongo = require('./Mongo.js');
const ReactionRolesSchema = require('./Schemas/ReactionRolesSchema.js');

/**
 * A class created for storing Reaction Role data from MongoDB
 */
class ReactionRolesManager {
    /**
     * @param {Client} client 
     */
    constructor(client){
        /**
         * The cache of Reaction Roles
         * @type {Collection<String, Collection<ReactionRoleSchema>>}
         */
        this.cache = new Collection();

        /**
         * The client of the user who instantiated the Manager
         * @type {Client}
         */
        this.client = client;
    }

    /**
     * Adds data to the cache
     * @param {ReactionRoleSchema} data 
     * @param {Collection<String, ReactionRoleSchema>} [cache=true] 
     */
    async add(data, cache = true){
        return await mongo().then(async mongoose => {
            try{
                const result = await ReactionRoleSchema.findOne({messageID: data.messageID, emojiID: data.emojiID});

                if(!result){
                    return await new ReactionRoleSchema({
                        messageID: data.messageID,
                        roleID: data.roleID,
                        emojiID: data.emojiID
                    }).save().then(() => {
                        const existing = this.cache.get(data.messageID);
                        if(existing && cache) existing.set(data.emojiID, data);
                        if(existing) return existing;

                        if (cache) {
                            this.cache.set(data.messageID, new Collection());
                            this.cache.get(data.messageID).set(data.emojiID, data);
                        };
                        return data;
                    });
                }
                const existing = this.cache.get(data.messageID);
                if(existing && cache) existing.set(data.emojiID, data);
                if(existing) return existing;

                if (cache) {
                    this.cache.set(data.messageID, new Collection());
                    this.cache.get(data.messageID).set(data.emojiID, data)
                };
                return data;
            }finally{
                mongoose.connection.close();
            }
        })
    }

    /**
     * Removes Reaction Role from database and cache
     * @param {String} messageID 
     * @param {String} emojiID 
     */
    async remove(messageID, emojiID){
        return await mongo().then(async mongoose => {
            try{
                return await ReactionRoleSchema.findOneAndDelete({emojiID})
                    .then(() => {
                        if(messageID && emojiID){
                            const hasMessage = this.cache.get(messageID);
                            if(hasMessage){
                                const hasEmote = hasMessage.has(emojiID);
                                if(hasEmote){
                                    this.cache.get(messageID).delete(emojiID);
                                }
                            }
                        }
                    })
            }finally{
                mongoose.connection.close();
            }
        })
    }
    
    /**
     * Fetches ReactionRole data from database or cache
     * @param {String} messageID 
     * @param {boolean} [cache=true] 
     * @param {boolean} [force=false] 
     * @returns {Promise<Collection<String, ReactionRoleSchema>|ReactionRolesManager>}
     * @example
     * // Fetch reaction roles from message
     * client.reactionRoles.fetch("819287885794246707")
     *  .then(reactions => reactions.filter())
     */
    async fetch(messageID, cache = true, force = false) {
        if(messageID && !force){
            const existing = this.cache.get(messageID);
            if(existing) return existing;
        }

        return await mongo().then(async mongoose => {
            try {
                const roles = await ReactionRolesSchema.find({messageID});
                for(const role of roles) await this.add(role, cache);
                return messageID ? this.cache.get(messageID) || null : this;
            }finally{
                mongoose.connection.close();
            }
        })
    }
}

module.exports = ReactionRolesManager;