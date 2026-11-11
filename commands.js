const selfcare = require("./selfcare");
const movement = require("./movement");
const fight = require("./fight");
const gamemode = require("./gamemode");
const botManager = require("./bot");

let bot;
let config;

const randomNames = [
    "FrostByte47",
    "LunarMango",
    "VoidNinja82",
    "PixelRaccoon",
    "BlazeToast",
    "ShadowPebble",
    "CreamyPotato",
    "TurboPenguin",
    "NeonWaffle",
    "CloudyGoblin",
    "BerryPhantom",
    "GhostyPickle",
    "AquaBunny",
    "CrispyEnder",
    "MysticCactus",
    "SneakyMelon",
    "CosmicToast",
    "SleepyViper",
    "DiamondDuck",
    "SpicySlime"
];

const musicTracks = [
    { name: "Minecraft", sound: "music.game" },
    { name: "Clark", sound: "music.game" },
    { name: "Sweden", sound: "music.game" },
    { name: "Subwoofer Lullaby", sound: "music.game" },
    { name: "Living Mice", sound: "music.game" },
    { name: "Haggstrom", sound: "music.game" },
    { name: "Mice on Venus", sound: "music.game" },
    { name: "Dry Hands", sound: "music.game" },
    { name: "Wet Hands", sound: "music.game" },
    { name: "Danny", sound: "music.game" },
    { name: "Key", sound: "music.game" },
    { name: "Oxygene", sound: "music.game" },
    { name: "Excuse", sound: "music.game" },
    { name: "Door", sound: "music.game" },
    { name: "Beginning 2", sound: "music.game" },
    { name: "Floating Trees", sound: "music.game" },
    { name: "Mutation", sound: "music.game" },
    { name: "Biome Fest", sound: "music.game" },
    { name: "Moog City", sound: "music.game" },
    { name: "Aria Math", sound: "music.game" },
    { name: "Dreiton", sound: "music.game" },
    { name: "Taswell", sound: "music.game" },
    { name: "Alpha", sound: "music.game" },
    { name: "Beginning", sound: "music.game" },
    { name: "Concrete Halls", sound: "music.game" },
    { name: "Dead Voxel", sound: "music.game" },
    { name: "Haunt Muskie", sound: "music.game" },
    { name: "Warmth", sound: "music.game" },
    { name: "Floating Dream", sound: "music.game" },
    { name: "Rubedo", sound: "music.game" },
    { name: "Chrysopoeia", sound: "music.game" },
    { name: "Infinite Amethyst", sound: "music.game" },
    { name: "Ancestry", sound: "music.game" },
    { name: "Aerie", sound: "music.game" },
    { name: "Stand Tall", sound: "music.game" },
    { name: "Left to Bloom", sound: "music.game" },
    { name: "One More Day", sound: "music.game" },
    { name: "A Familiar Room", sound: "music.game" },
    { name: "An Ordinary Day", sound: "music.game" },
    { name: "Wending", sound: "music.game" },
    { name: "Infinite Amethyst", sound: "music.game" },
    { name: "Otherside", sound: "music.game" },
    { name: "5", sound: "music.game" },
    { name: "Relic", sound: "music.game" },
    { name: "Precipice", sound: "music.game" },
    { name: "Creator", sound: "music.game" },
    { name: "Creator Music Box", sound: "music.game" }
];

const musicDiscs = [
    { name: "13", sound: "music_disc.13" },
    { name: "Cat", sound: "music_disc.cat" },
    { name: "Blocks", sound: "music_disc.blocks" },
    { name: "Chirp", sound: "music_disc.chirp" },
    { name: "Far", sound: "music_disc.far" },
    { name: "Mall", sound: "music_disc.mall" },
    { name: "Mellohi", sound: "music_disc.mellohi" },
    { name: "Stal", sound: "music_disc.stal" },
    { name: "Strad", sound: "music_disc.strad" },
    { name: "Ward", sound: "music_disc.ward" },
    { name: "11", sound: "music_disc.11" },
    { name: "Wait", sound: "music_disc.wait" },
    { name: "Otherside", sound: "music_disc.otherside" },
    { name: "5", sound: "music_disc.5" },
    { name: "Pigstep", sound: "music_disc.pigstep" },
    { name: "Relic", sound: "music_disc.relic" },
    { name: "Creator", sound: "music_disc.creator" },
    { name: "Creator Music Box", sound: "music_disc.creator_music_box" },
    { name: "Precipice", sound: "music_disc.precipice" }
];

const allMusic =
    musicTracks.concat(musicDiscs);

module.exports = {
    init: function(client, cfg) {
        bot = client;
        config = cfg;

        console.log("[Commands] Loaded.");
    },

    handleChat: function(username, message) {
        console.log(
            "[CMD] " +
            username +
            ": " +
            message
        );

        // HELP
        if (message === "!help") {
            bot.chat(
                '/tellraw @a {"text":"[iBot] !info | !bot | !fight | !fightstop | !random | !gmc | !gms | !move | !jump | !stop | !orbit | !selfcare | !music","color":"blue"}'
            );
            return;
        }

        // MUSIC
        if (message === "!music") {
            bot.chat(
                "/playsound minecraft:music.game master @a ~ ~ ~ 1 1"
            );

            bot.chat(
                '/tellraw @a [{"text":"[iBot] ","color":"blue","bold":true},{"text":"Playing music 🎵","color":"aqua"}]'
            );

            return;
        }

        // MUSIC LIST
        if (message === "!music list") {
            bot.chat(
                '/tellraw @a {"text":"[iBot] OG Minecraft Music + Music Discs:","color":"blue","bold":true}'
            );

            for (
                let i = 0;
                i < allMusic.length;
                i++
            ) {
                bot.chat(
                    '/tellraw @a {"text":"' +
                    (i + 1) +
                    ". " +
                    allMusic[i].name +
                    '","color":"aqua"}'
                );
            }

            return;
        }

        // MUSIC PLAY
        if (
            message.indexOf("!music play ") === 0
        ) {
            const args =
                message.trim().split(/\s+/);

            const number =
                Number(args[2]);

            if (
                !Number.isInteger(number) ||
                number < 1 ||
                number > allMusic.length
            ) {
                bot.chat(
                    '/tellraw @a {"text":"[iBot] Invalid music number. Use !music list","color":"red"}'
                );
                return;
            }

            const track =
                allMusic[number - 1];

            bot.chat(
                "/playsound minecraft:" +
                track.sound +
                " master @a ~ ~ ~ 1 1"
            );

            bot.chat(
                '/tellraw @a {"text":"[iBot] Playing #' +
                number +
                ": " +
                track.name +
                ' 🎵","color":"aqua"}'
            );

            return;
        }

        // INFO
        if (message === "!info") {
            const memory =
                process.memoryUsage();

            const usedMB =
                (
                    memory.rss /
                    1024 /
                    1024
                ).toFixed(1);

            const totalMB =
                (
                    memory.heapTotal /
                    1024 /
                    1024
                ).toFixed(1);

            bot.chat(
                '/tellraw @a {"text":"[iBot] Server: ' +
                config.bot.host +
                ":" +
                (config.bot.port || 25565) +
                " | Ping: " +
                (bot.player?.ping ?? "N/A") +
                "ms | Memory: " +
                usedMB +
                " MB / " +
                totalMB +
                " MB | Bots: " +
                botManager.getBots().length +
                '","color":"aqua"}'
            );

            return;
        }

        // BOT COMMAND
        if (
            message.indexOf("!bot ") === 0
        ) {
            const args =
                message.trim().split(/\s+/);

            // !bot amount 5
            if (
                args.length === 3 &&
                args[1].toLowerCase() ===
                    "amount"
            ) {
                const amount =
                    Number(args[2]);

                if (
                    !Number.isInteger(amount) ||
                    amount <= 0
                ) {
                    bot.chat(
                        '/tellraw @a {"text":"[iBot] Invalid amount.","color":"red"}'
                    );
                    return;
                }

                spawnMultipleBots(amount);
                return;
            }

            // !bot AnyName
            if (args.length === 2) {
                const name = args[1];

                botManager.spawn(name);

                bot.chat(
                    '/tellraw @a {"text":"[iBot] Spawning ' +
                    name +
                    '","color":"green"}'
                );

                return;
            }

            bot.chat(
                '/tellraw @a {"text":"[iBot] Usage: !bot <name> OR !bot amount <number>","color":"yellow"}'
            );

            return;
        }

        // SELFCARE
        if (message === "!selfcare on") {
            selfcare.enable();
            return;
        }

        if (message === "!selfcare off") {
            selfcare.disable();
            return;
        }

        // GAMEMODE
        if (message === "!gmc") {
            gamemode.creative();
            return;
        }

        if (message === "!gms") {
            gamemode.survival();
            return;
        }

        // MOVEMENT
        if (message === "!move") {
            movement.move();
            return;
        }

        if (message === "!jump") {
            movement.jump();
            return;
        }

        // STOP EVERYTHING
        if (message === "!stop") {
            movement.stop();

            if (fight.stop) {
                fight.stop();
            }

            return;
        }

        // ORBIT
        if (
            message.indexOf("!orbit ") === 0
        ) {
            const target =
                message.split(" ")[1];

            movement.orbit(target);

            bot.chat(
                '/tellraw @a {"text":"[iBot] Orbiting ' +
                target +
                '","color":"aqua"}'
            );

            return;
        }

        if (message === "!orbitstop") {
            movement.orbitStop();
            return;
        }

        // RANDOM MOVEMENT
        if (message === "!random") {
            randomMoveBots();
            return;
        }

        // FIGHT
        if (
            message.indexOf("!fight ") === 0
        ) {
            const args =
                message.trim().split(/\s+/);

            const target = args[1];
            const selectedBot = args[2];

            if (!target) {
                return;
            }

            // !fight player @a
            if (selectedBot === "@a") {
                fight.startAll(target);
                return;
            }

            // !fight player botName
            if (selectedBot) {
                const targetBot =
                    botManager
                        .getBots()
                        .find(
                            function(currentBot) {
                                return (
                                    currentBot.username.toLowerCase() ===
                                    selectedBot.toLowerCase()
                                );
                            }
                        );

                if (!targetBot) {
                    bot.chat(
                        '/tellraw @a {"text":"[iBot] Bot not found: ' +
                        selectedBot +
                        '","color":"red"}'
                    );
                    return;
                }

                fight.startBot(
                    targetBot,
                    target
                );

                return;
            }

            // !fight player
            fight.start(target);
            return;
        }

        // FIGHT STOP
        if (message === "!fightstop") {
            fight.stop();
            return;
        }
    }
};

// ==========================================
// RANDOM MOVEMENT
// ==========================================

function randomMoveBots() {
    const bots =
        botManager
            .getBots()
            .filter(
                b =>
                    b &&
                    b.entity &&
                    b.health > 0
            );

    if (bots.length === 0) {
        bot.chat(
            '/tellraw @a {"text":"[iBot] No bots are connected.","color":"red"}'
        );
        return;
    }

    const directions = [
        "forward",
        "back",
        "left",
        "right"
    ];

    bots.forEach((botInstance, index) => {
        /*
         * Give every bot a random direction.
         * Because each bot gets its own random
         * choice, they won't all walk together.
         */
        const direction =
            directions[
                Math.floor(
                    Math.random() *
                    directions.length
                )
            ];

        try {
            botInstance.clearControlStates();

            botInstance.setControlState(
                direction,
                true
            );

            /*
             * Optional sprint makes the movement
             * more obvious, but only for this
             * 1-second random movement.
             */
            botInstance.setControlState(
                "sprint",
                direction === "forward"
            );

            setTimeout(() => {
                if (!botInstance.entity) {
                    return;
                }

                try {
                    botInstance.setControlState(
                        direction,
                        false
                    );

                    botInstance.setControlState(
                        "sprint",
                        false
                    );
                } catch {}
            }, 1000);
        } catch {}
    });

    bot.chat(
        '/tellraw @a {"text":"[iBot] All bots randomly moved for 1 second.","color":"aqua"}'
    );
}

// ==========================================
// SPAWN MULTIPLE BOTS
// ==========================================

function spawnMultipleBots(amount) {
    bot.chat(
        '/tellraw @a {"text":"[iBot] Starting ' +
        amount +
        ' bot spawns. One every 5 seconds.","color":"blue"}'
    );

    let spawned = 0;

    function spawnNext() {
        if (spawned >= amount) {
            return;
        }

        let name;

        if (spawned < randomNames.length) {
            name = randomNames[spawned];
        } else {
            name =
                generateRandomUsername();
        }

        while (
            botManager
                .getBots()
                .some(
                    function(existingBot) {
                        return (
                            existingBot.username ===
                            name
                        );
                    }
                )
        ) {
            name =
                generateRandomUsername();
        }

        botManager.spawn(name);

        bot.chat(
            '/tellraw @a {"text":"[iBot] Spawning ' +
            name +
            " (" +
            (spawned + 1) +
            "/" +
            amount +
            ')","color":"green"}'
        );

        spawned++;

        if (spawned < amount) {
            setTimeout(
                spawnNext,
                5000
            );
        } else {
            bot.chat(
                '/tellraw @a {"text":"[iBot] Finished spawning ' +
                amount +
                ' bots.","color":"blue"}'
            );
        }
    }

    spawnNext();
}

// ==========================================
// RANDOM USERNAME GENERATOR
// ==========================================

function generateRandomUsername() {
    const prefixes = [
        "Shadow",
        "Frost",
        "Lunar",
        "Pixel",
        "Turbo",
        "Cosmic",
        "Neon",
        "Mystic",
        "Aqua",
        "Ghost",
        "Crazy",
        "Sneaky",
        "Ultra",
        "Mega",
        "Dark",
        "Cloudy"
    ];

    const suffixes = [
        "Wolf",
        "Bunny",
        "Slime",
        "Duck",
        "Toast",
        "Potato",
        "Creeper",
        "Dragon",
        "Penguin",
        "Pickle",
        "Melon",
        "Raccoon",
        "Ender",
        "Viper",
        "Goblin",
        "Phantom"
    ];

    const prefix =
        prefixes[
            Math.floor(
                Math.random() *
                prefixes.length
            )
        ];

    const suffix =
        suffixes[
            Math.floor(
                Math.random() *
                suffixes.length
            )
        ];

    const number =
        Math.floor(
            Math.random() * 10000
        );

    return (
        prefix +
        suffix +
        number
    );
}