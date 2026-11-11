let bot;


module.exports = {


    init(client) {

        bot = client;

        console.log("[CommandBlock] Loaded.");

    },



    run(command) {


        if (!command) return;


        bot.chat(command);


    },


    tellraw(message, color = "white") {


        bot.chat(
            `/tellraw @a {"text":"[iBot] ${message}","color":"${color}"}`
        );


    }


};