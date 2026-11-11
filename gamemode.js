let bot;

module.exports = {

    init(client) {

        bot = client;

        console.log("[Gamemode] Loaded.");

    },

    creative() {

        bot.chat("/gamemode creative");

        bot.chat(
            `/tellraw @a {"text":"[iBot] Switched to Creative","color":"green"}`
        );

    },

    survival() {

        bot.chat("/gamemode survival");

        bot.chat(
            `/tellraw @a {"text":"[iBot] Switched to Survival","color":"yellow"}`
        );

    }

};