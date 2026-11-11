const bots = new Map();
let selectedBot = null;

module.exports = {

    bots,

    getSelected() {
        return selectedBot;
    },

    selectBot(name) {

        const bot = bots.get(name);

        if (bot) {
            selectedBot = bot;
            return true;
        }

        return false;
    },

    addBot(name, bot) {

        bots.set(name, bot);

        if (!selectedBot) {
            selectedBot = bot;
        }

    },

    removeBot(name) {

        const bot = bots.get(name);

        if (!bot) {
            return false;
        }

        bots.delete(name);

        if (selectedBot === bot) {
            selectedBot = null;
        }

        return true;
    },

    getBot(name) {
        return bots.get(name);
    },

    listBots() {
        return [...bots.keys()];
    },

    tellraw(bot, message, color = "white") {

        if (!bot) return;

        const json = JSON.stringify({
            text: `[iBot] ${message}`,
            color: color
        });

        bot.chat(`/tellraw @a ${json}`);

    }

};