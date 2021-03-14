const { Client, Collection } = require('discord.js');
const ProfileSchema = require('./Schemas/ProfileSchema.js');
const mongo = require('./Mongo.js');

/**
 * Stores information such as Friend Code and IGN (And perhaps more in the future)
 */
class ProfileManager {
    /**
     * @param {Client} client 
     */
    constructor(client){
        /**
         * @type {Client}
         */
        this.client = client;

        /**
         * @type {Collection<String, ProfileSchema>}
         */
        this.cache = new Collection();
    }

    /**
     * Adds a value to the cache
     * @param {ProfileSchema} profile 
     * @param {boolean} [cache=true]
     */
    add(profile, cache = true){
        const existing = this.cache.get(profile.userID);
        if(existing && cache) this.cache.set(profile.userID, profile);
        if(existing) return existing;

        if(cache){
            this.cache.set(profile.userID, profile);
        }
        return profile;
    }
    
    /**
     * Updates the In-Game Name of a user
     * @param {String} newIGN 
     * @param {String} userID 
     * @param {boolean} cache 
     */
    async updateIGN(newIGN, userID, cache = true){
        return await mongo().then(async mongoose => {
            try{
                const result = await ProfileSchema.findOne({userID});

                if(result){
                    result.ign = newIGN;
                    return await result.save().then(() => {
                        this.add(result, cache);
                    })
                }else{
                    const newProfile = new ProfileSchema({
                        userID: userID,
                        fc: "Friend code not set, use !setfc <fc> to set your friend code.",
                        ign: newIGN
                    })
                    
                    return await newProfile.save().then(() => {
                        this.add(newProfile, cache);
                    })
                }
            }finally{
                mongoose.connection.close();
            }
        })
    }

    /**
     * Updates cache and value of a users friend code
     * @param {String} newFC 
     * @param {String} userID 
     * @param {boolean} cache 
     */
    async updateFC(newFC, userID, cache = true){
        return await mongo().then(async mongoose => {
            try{
                const result = await ProfileSchema.findOne({userID});

                if(result){
                    result.fc = newFC;
                    return await result.save().then(() => {
                        this.add(result, cache);
                    })
                }else{
                    const newProfile = new ProfileSchema({
                        userID: userID,
                        fc: newFC,
                        ign: "In-Game Name not set, use !setign <ign> to set your in-game name."
                    })
                    
                    return await newProfile.save().then(() => {
                        this.add(newProfile, cache);
                    })
                }
            }finally{
                mongoose.connection.close();
            }
        })
    }

    /**
     * Fetches a user's Profile from the cache or from the database
     * @param {String} userID 
     * @param {boolean} [cache=true]
     * @param {boolean} [force=true]
     * @returns {Promise<ProfileSchema|ProfileManager>}
     */
    async fetch(userID, cache = true, force = false){
        if(userID && !force){
            const existing = this.cache.get(userID);
            if(existing) return existing;
        }

        return await mongo().then(async mongoose => {
            try{
                const profile = await ProfileSchema.findOne({userID});
                
                if(profile) this.add(profile, cache);

                return userID ? this.cache.get(userID) || null : this;
            }finally{
                mongoose.connection.close();
            }
        })
    }
}

module.exports = ProfileManager;