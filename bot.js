const mineflayer = require("mineflayer");
const config = require("./config");
const core = require("./core");

let bots = [];

module.exports = {

    spawn(username) {

        const newBot = mineflayer.createBot({
            host: config.bot.host,
            port: config.bot.port,
            auth: "offline",
            username: username,
            version: config.bot.version
        });

        newBot.once("spawn", () => {

            console.log(`[Bot] ${username} spawned.`);

            core.addBot(username, newBot);

            newBot.chat(
                `/tellraw @a {"text":"[iBot] ${username} joined","color":"green"}`
            );

        });

        newBot.on("chat", (player, message) => {

            console.log(`[${username}] ${player}: ${message}`);

        });

        newBot.on("end", () => {

            console.log(`[Bot] ${username} disconnected.`);

            core.removeBot(username);

        });

        bots.push(newBot);

        return newBot;

    },

    getBots() {

        return bots;

    }

};