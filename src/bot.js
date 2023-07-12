import dotenv from 'dotenv';
dotenv.config();
import { Client, Intents, GatewayIntentBits } from 'discord.js';
import fetch from "node-fetch";

//Botin alustaminen ja oikeuksien kanssa säätämistä.
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    allowedMentions: {parse: ['users', 'roles'], repliedUser: true}
});

//Ilmoitus terminaaliin, kun botti on valmiina.
client.on('ready', () => {
    console.log(`sisäänkirjautuminen käyttäjänä: ${client.user.tag}`)
});

client.on('messageCreate', (message) => {
    //Jättää huomiotta botin omat viestit.
    if (message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`)

    //Kirjoittaa chattiin botin viiveen komennolla ".ping"
    if (message.content === '.ping'){
        message.channel.send(`Pong! viiveet: ${Date.now() - message.createdTimestamp}ms, ${client.ws.ping}ms `);
    }

    //Kirjoittaa chattiin satunnaisen vitsin komennolla ".joke"
    if(message.content === '.joke'){
        const getJoke = async () => {
            const result = await fetch('https://official-joke-api.appspot.com/jokes/random');
            const json = await result.json();
            return json;
        }
        let joke;

        getJoke().then((data) => {
            joke = data;
            message.channel.send(`${joke.setup} ${joke.punchline}`);
        })
    };
    
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
