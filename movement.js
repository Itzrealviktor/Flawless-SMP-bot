const { Vec3 } = require("vec3");

let bot;
let moving = false;
let jumping = false;
let orbiting = false;
let orbitInterval = null;
let orbitTarget = null;

module.exports = {

    init(client) {

        bot = client;

        console.log("[Movement] Loaded.");

    },

    move() {

        moving = true;

        bot.setControlState("forward", true);

    },

    jump() {

        jumping = true;

        const loop = setInterval(() => {

            if (!jumping) {

                clearInterval(loop);

                return;

            }

            bot.setControlState("jump", true);

            setTimeout(() => {

                bot.setControlState("jump", false);

            }, 200);

        }, 400);

    },

    stop() {

        moving = false;
        jumping = false;

        bot.clearControlStates();

        if (orbitInterval) {

            clearInterval(orbitInterval);

            orbitInterval = null;

        }

        orbiting = false;
        orbitTarget = null;

    },

    orbit(playerName) {

        const player = bot.players[playerName];

        if (!player || !player.entity) {

            bot.chat(
                `/tellraw @a {"text":"[iBot] Player not found","color":"red"}`
            );

            return;

        }

        if (orbitInterval) {

            clearInterval(orbitInterval);

        }

        orbiting = true;
        orbitTarget = playerName;

        let angle = 0;

        orbitInterval = setInterval(() => {

            const target = bot.players[orbitTarget];

            if (!target || !target.entity) {

                return;

            }

            angle += 0.15;

            const radius = 3;

            const pos = new Vec3(
                target.entity.position.x + Math.cos(angle) * radius,
                target.entity.position.y + 1,
                target.entity.position.z + Math.sin(angle) * radius
            );

            bot.lookAt(pos, true);

            bot.setControlState("forward", true);

        }, 100);

    },

    orbitStop() {

        if (orbitInterval) {

            clearInterval(orbitInterval);

            orbitInterval = null;

        }

        orbiting = false;
        orbitTarget = null;

        bot.clearControlStates();

    }

};