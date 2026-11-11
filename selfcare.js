let bot;
let enabled = false;
let loop = null;

module.exports = {

    init(client) {

        bot = client;

        console.log("[Selfcare] Loaded.");

    },

    enable() {

        if (enabled) return;

        enabled = true;

        loop = setInterval(() => {

            if (!bot || !bot.entity) return;

            // Force creative if not already creative
            if (bot.game && bot.game.gameMode !== "creative") {

                bot.chat("/gamemode creative");

            }

            // Eat if hungry
            if (bot.food < 18) {

                const food = bot.inventory
                    .items()
                    .find(item =>
                        item.name.includes("bread") ||
                        item.name.includes("apple") ||
                        item.name.includes("steak")
                    );

                if (food) {

                    bot.equip(food, "hand")
                        .then(() => bot.consume())
                        .catch(() => {});

                }

            }

        }, 3000);

    },

    disable() {

        enabled = false;

        if (loop) {

            clearInterval(loop);

            loop = null;

        }

    }

};