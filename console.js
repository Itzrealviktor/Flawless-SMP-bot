let bot;
let readline = require("readline");

module.exports = {

    init(client) {

        bot = client;

        console.log("[Console] Module loaded!");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("line", (message) => {

            if (!bot) return;

            bot.chat(
                `/tellraw @a [{"text":"[iBot] ","color":"red","bold":true},{"text":"${message}","color":"white"}]`
            );

        });

    }

};