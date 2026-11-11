let bot;
let orbiting = false;
let interval;


module.exports = {

    init(client) {

        bot = client;

        console.log("[iBot] Orbit loaded.");

    },


    start() {

        if (orbiting) return;

        orbiting = true;

        let angle = 0;

        bot.chat(
            '/tellraw @a {"text":"[iBot] Orbit enabled","color":"aqua"}'
        );


        interval = setInterval(() => {

            if (!orbiting) return;


            angle += 0.3;


            let x = Math.cos(angle) * 3;
            let z = Math.sin(angle) * 3;


            bot.look(
                bot.entity.yaw + 0.3,
                bot.entity.pitch,
                true
            );


            bot.setControlState("forward", true);


        }, 100);

    },


    stop() {

        orbiting = false;


        if (interval) {

            clearInterval(interval);

        }


        bot.clearControlStates();


        bot.chat(
            '/tellraw @a {"text":"[iBot] Orbit stopped","color":"red"}'
        );

    }

};