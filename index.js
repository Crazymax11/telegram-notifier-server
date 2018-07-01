const fs = require('fs');
const Server = require('./server.js');
const Bot = require('./bot.js');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
let state;
if (fs.existsSync('state.json')) {
    state = JSON.parse(fs.readFileSync('state.json'));
}

const bot = new Bot(
    new TelegramBot(token, { polling: true }),
    process.env.TELEGRAM_FIRSTNAME,
    process.env.TELEGRAM_USERNAME,
    state
);

const server = new Server(bot, process.env.TELEGRAM_NOTIFIER_PORT || process.env.PORT || 80);

setInterval(() => {
    const state = bot.getState();
    fs.writeFileSync('state.json', JSON.stringify(state));
}, 1000 * 60 * 30);
