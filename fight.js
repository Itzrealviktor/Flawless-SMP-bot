const botManager = require("./bot");
const { Vec3 } = require("vec3");

let bot;
let fighting = false;
let targetName = null;
let fightInterval = null;

const botFightIntervals = new Map();

module.exports = {
    init(client) {
        bot = client;
        console.log("[Fight] Loaded.");
    },

    start(playerName) {
        const player = findPlayer(bot, playerName);

        if (!player) {
            bot.chat(
                `/tellraw @a {"text":"[iBot] Player not found: ${playerName}","color":"red"}`
            );
            return;
        }

        targetName = player.username;
        fighting = true;

        if (fightInterval) {
            clearInterval(fightInterval);
        }

        // IMPORTANT:
        // Clear old movement states when starting a new fight.
        stopMovement(bot);

        let lastPosition = null;
        let stuckTime = 0;
        let nextAttack = Date.now() + 500;

        bot.chat(
            `/tellraw @a {"text":"[iBot] Fighting ${targetName}","color":"red"}`
        );

        fightInterval = setInterval(() => {
            if (!fighting || !bot || !bot.entity) {
                return;
            }

            const target = findPlayer(bot, targetName);

            if (!target || !target.entity) {
                // Do not keep walking/attacking an old position.
                stopMovement(bot);
                lastPosition = null;
                stuckTime = 0;
                return;
            }

            const result = fightBot(
                bot,
                target,
                lastPosition,
                stuckTime,
                nextAttack
            );

            lastPosition = result.lastPosition;
            stuckTime = result.stuckTime;
            nextAttack = result.nextAttack;
        }, 100);
    },

    startBot(botToFight, playerName) {
        if (!botToFight) {
            return;
        }

        const target = findPlayer(botToFight, playerName);

        if (!target) {
            return;
        }

        // Kill an old fight loop for this bot.
        if (botFightIntervals.has(botToFight.username)) {
            clearInterval(
                botFightIntervals.get(botToFight.username)
            );

            botFightIntervals.delete(botToFight.username);
        }

        // VERY IMPORTANT after reconnect:
        // Reset all movement states so the bot doesn't
        // keep an old forward/left/right state.
        stopMovement(botToFight);

        let lastPosition = null;
        let stuckTime = 0;
        let nextAttack = Date.now() + 500;

        const interval = setInterval(() => {
            if (!botToFight || !botToFight.entity) {
                return;
            }

            const currentTarget = findPlayer(
                botToFight,
                playerName
            );

            // Target disappeared / bot lost sight of player.
            if (
                !currentTarget ||
                !currentTarget.entity ||
                botToFight.health <= 0
            ) {
                stopMovement(botToFight);
                lastPosition = null;
                stuckTime = 0;
                return;
            }

            const result = fightBot(
                botToFight,
                currentTarget,
                lastPosition,
                stuckTime,
                nextAttack
            );

            lastPosition = result.lastPosition;
            stuckTime = result.stuckTime;
            nextAttack = result.nextAttack;
        }, 100);

        botFightIntervals.set(
            botToFight.username,
            interval
        );

        return interval;
    },

    startAll(playerName) {
        const bots = botManager.getBots();

        let started = 0;

        for (const botInstance of bots) {
            const target = findPlayer(
                botInstance,
                playerName
            );

            if (target) {
                this.startBot(
                    botInstance,
                    target.username
                );

                started++;
            }
        }

        if (started === 0) {
            bot.chat(
                `/tellraw @a {"text":"[iBot] None of the bots can see ${playerName}","color":"red"}`
            );
            return;
        }

        bot.chat(
            `/tellraw @a {"text":"[iBot] ${started} bot(s) fighting ${playerName}","color":"red"}`
        );
    },

    stop() {
        fighting = false;
        targetName = null;

        if (fightInterval) {
            clearInterval(fightInterval);
            fightInterval = null;
        }

        if (bot) {
            stopMovement(bot);
        }

        for (
            const [username, interval]
            of botFightIntervals
        ) {
            clearInterval(interval);

            const botInstance =
                botManager
                    .getBots()
                    .find(
                        b => b.username === username
                    );

            if (botInstance) {
                stopMovement(botInstance);
            }
        }

        botFightIntervals.clear();

        if (bot) {
            bot.chat(
                `/tellraw @a {"text":"[iBot] Fight stopped","color":"green"}`
            );
        }
    }
};

function findPlayer(botInstance, playerName) {
    if (!botInstance || !playerName) {
        return null;
    }

    const exact =
        botInstance.players[playerName];

    if (exact) {
        return exact;
    }

    const wanted =
        playerName.toLowerCase();

    for (
        const name in botInstance.players
    ) {
        if (
            name.toLowerCase() === wanted
        ) {
            return botInstance.players[name];
        }
    }

    return null;
}

function stopMovement(botInstance) {
    if (!botInstance) {
        return;
    }

    try {
        botInstance.clearControlStates();
    } catch {}

    try {
        botInstance.setControlState("forward", false);
        botInstance.setControlState("back", false);
        botInstance.setControlState("left", false);
        botInstance.setControlState("right", false);
        botInstance.setControlState("jump", false);
        botInstance.setControlState("sprint", false);
    } catch {}
}

function fightBot(
    botInstance,
    target,
    lastPosition,
    stuckTime,
    nextAttack
) {
    if (
        !botInstance ||
        !botInstance.entity ||
        !target ||
        !target.entity
    ) {
        return {
            lastPosition,
            stuckTime,
            nextAttack
        };
    }

    const position =
        botInstance.entity.position;

    const targetPosition =
        target.entity.position;

    const distance =
        position.distanceTo(
            targetPosition
        );

    /*
     * LOOK AT TARGET
     */
    try {
        botInstance.lookAt(
            targetPosition.offset(0, 1.5, 0),
            true
        );
    } catch {}

    /*
     * ANTI-STACKING
     */
    const bots =
        botManager
            .getBots()
            .filter(
                b =>
                    b &&
                    b.entity &&
                    b.health > 0
            );

    let botIndex =
        bots.findIndex(
            b =>
                b.username ===
                botInstance.username
        );

    if (botIndex < 0) {
        botIndex = 0;
    }

    const botCount =
        Math.max(1, bots.length);

    const spreadRadius = 2.2;

    const angle =
        (Math.PI * 2 * botIndex) /
        botCount;

    const wantedX =
        targetPosition.x +
        Math.cos(angle) *
        spreadRadius;

    const wantedZ =
        targetPosition.z +
        Math.sin(angle) *
        spreadRadius;

    let moveX =
        wantedX - position.x;

    let moveZ =
        wantedZ - position.z;

    const wantedDistance =
        Math.sqrt(
            moveX * moveX +
            moveZ * moveZ
        );

    /*
     * CHECK NEARBY BOTS
     */
    let nearbyBot = false;

    for (
        const otherBot of bots
    ) {
        if (
            otherBot === botInstance ||
            !otherBot.entity
        ) {
            continue;
        }

        const dx =
            position.x -
            otherBot.entity.position.x;

        const dz =
            position.z -
            otherBot.entity.position.z;

        const horizontalDistance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (horizontalDistance < 1.7) {
            nearbyBot = true;
            break;
        }
    }

    /*
     * BLOCK CHECK
     */
    const yaw =
        botInstance.entity.yaw;

    const forwardX =
        -Math.sin(yaw);

    const forwardZ =
        -Math.cos(yaw);

    const blockX =
        Math.floor(
            position.x +
            forwardX * 0.9
        );

    const blockY =
        Math.floor(position.y);

    const blockZ =
        Math.floor(
            position.z +
            forwardZ * 0.9
        );

    const blockAhead =
        botInstance.blockAt(
            new Vec3(
                blockX,
                blockY,
                blockZ
            )
        );

    const blockAbove =
        botInstance.blockAt(
            new Vec3(
                blockX,
                blockY + 1,
                blockZ
            )
        );

    const blockBelow =
        botInstance.blockAt(
            new Vec3(
                blockX,
                blockY - 1,
                blockZ
            )
        );

    const solidAhead =
        blockAhead &&
        blockAhead.boundingBox === "block";

    const solidAbove =
        blockAbove &&
        blockAbove.boundingBox === "block";

    /*
     * WATER
     */
    let avoidingWater = false;

    if (
        blockAhead &&
        isWater(blockAhead)
    ) {
        avoidingWater = true;
    }

    if (
        blockBelow &&
        isWater(blockBelow)
    ) {
        avoidingWater = true;
    }

    /*
     * STUCK DETECTION
     */
    if (lastPosition) {
        const horizontalMoved =
            Math.sqrt(
                Math.pow(
                    position.x -
                    lastPosition.x,
                    2
                ) +
                Math.pow(
                    position.z -
                    lastPosition.z,
                    2
                )
            );

        if (horizontalMoved < 0.08) {
            stuckTime += 100;
        } else {
            stuckTime = 0;
        }
    }

    const newLastPosition =
        position.clone();

    /*
     * JUMP ONLY WHEN NEEDED
     */
    if (
        (
            stuckTime >= 1000 &&
            distance > 1.5
        ) ||
        (
            solidAhead &&
            !solidAbove &&
            distance > 1.5
        )
    ) {
        try {
            botInstance.setControlState(
                "jump",
                true
            );

            setTimeout(() => {
                if (botInstance.entity) {
                    try {
                        botInstance.setControlState(
                            "jump",
                            false
                        );
                    } catch {}
                }
            }, 350);
        } catch {}

        stuckTime = 0;
    }

    /*
     * ATTACK EVERY 500 MS
     *
     * Only attack when actually close.
     * This prevents the bot from swinging
     * at an old position after reconnecting.
     */
    if (
        distance <= 3 &&
        Date.now() >= nextAttack
    ) {
        try {
            botInstance.attack(
                target.entity
            );
        } catch {}

        nextAttack =
            Date.now() + 500;
    }

    /*
     * MOVEMENT
     *
     * Don't move toward an old target position.
     * Always calculate movement from the
     * CURRENT target entity.
     */
    if (
        nearbyBot ||
        wantedDistance > 0.55 ||
        avoidingWater
    ) {
        if (avoidingWater) {
            moveX +=
                -forwardZ * 2;

            moveZ +=
                forwardX * 2;
        }

        if (
            Math.abs(moveX) < 0.01 &&
            Math.abs(moveZ) < 0.01
        ) {
            moveX = 1;
            moveZ = 0;
        }

        const moveAngle =
            Math.atan2(
                -moveX,
                -moveZ
            );

        const angleDifference =
            moveAngle -
            botInstance.entity.yaw;

        const normalizedAngle =
            Math.atan2(
                Math.sin(angleDifference),
                Math.cos(angleDifference)
            );

        /*
         * IMPORTANT:
         * If the bot is behind the target,
         * turn instead of constantly pushing
         * forward into one location.
         */
        botInstance.setControlState(
            "forward",
            Math.abs(normalizedAngle) < 2.5
        );

        botInstance.setControlState(
            "left",
            normalizedAngle > 0.25
        );

        botInstance.setControlState(
            "right",
            normalizedAngle < -0.25
        );
    } else {
        botInstance.setControlState(
            "forward",
            false
        );

        botInstance.setControlState(
            "left",
            false
        );

        botInstance.setControlState(
            "right",
            false
        );
    }

    return {
        lastPosition: newLastPosition,
        stuckTime,
        nextAttack
    };
}

function isWater(block) {
    if (!block) {
        return false;
    }

    return (
        block.name === "water" ||
        block.name === "flowing_water"

     );
}