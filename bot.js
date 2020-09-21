const { Client } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
        disableEveryone: true
});

async function ConnectToChannel(message) {

    var isConnected = false;
    const connectionList = client.voice.connections;

    for(let [key, value] of connectionList)
        if(key == message.guild.id)
            isConnected = true;

    if(!isConnected) {
        if (message.member.voice.channel) {
            await message.member.voice.channel.join();

            client.user.setPresence({
                activity: {
                    name: "Waiting for the game to start...",
                    type: "CUSTOM_STATUS"
                }
            });

            return true;
        } else {
            message.reply("You **must** be connected to a voice channel!");
            return false;
        }
    } else {
        return message.reply("I'm already connected to your voice channel!");
    }
}

async function SetMute(message, inGame) {
    const connectionList = client.voice.connections;
    var memberList;

    for(let [key, value] of connectionList)
        if(key == message.guild.id)
            memberList = value.channel.members;

    for (let [key, value] of memberList)
        value.voice.setMute(inGame);
}

config({
    path: __dirname + "/.env"
});

client.on("ready", () => {
    console.log(`Logged in as : ${client.user.username}`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "Waiting for users...",
            type: "WATCHING"
        }
    });
});

client.on("message", async message => {

    if(!message.guild) return;
    if(message.author.bot) return;

    if(message.content.startsWith("!conn")) {
        ConnectToChannel(message)
    }

    if (message.content.startsWith("!disc")) {
        var isConnected = false;
        const connectionList = client.voice.connections;

        for (let [key, value] of connectionList)
            if (key == message.guild.id)
                isConnected = true;

        if(!isConnected)
            message.reply("You need to fire \"!conn\" first!");
        else
            SetMute(message, false);
    }

    if (message.content.startsWith("!game")) {
        var isConnected = false;
        const connectionList = client.voice.connections;

        for (let [key, value] of connectionList)
            if (key == message.guild.id)
                isConnected = true;

        if (!isConnected)
            message.reply("You need to fire \"!conn\" first!");
        else
            SetMute(message, true);
    }

    if(message.author.username != client.user.username)
        console.log(`${message.author.username} sent: ${message.content}`);
});

client.login(process.env.TOKEN);

