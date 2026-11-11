const mineflayer = require("mineflayer");
const config = require("./config");
const commands = require("./commands");
const selfcare = require("./selfcare");
const movement = require("./movement");
const fight = require("./fight");
const gamemode = require("./gamemode");

let bot;

function startBot() {

    bot = mineflayer.createBot(config.bot);

    bot.once("spawn", function() {

        console.log(
            "[iBot] Connected to " +
            config.bot.host +
            ":" +
            config.bot.port
        );

        commands.init(bot, config);
        selfcare.init(bot);
        movement.init(bot);
        fight.init(bot);
        gamemode.init(bot);

    });

    bot.on("chat", function(username, message) {

        if (username === bot.username) {
            return;
        }

        commands.handleChat(username, message);

    });

    bot.on("end", function() {

        console.log(
            "[iBot] Disconnected. Reconnecting in " +
            config.settings.reconnectDelay +
            "ms..."
        );

        setTimeout(
            startBot,
            config.settings.reconnectDelay
        );

    });

    bot.on("error", function(error) {

        console.log(
            "[iBot] Error: " +
            error.message
        );

    });

}

startBot();