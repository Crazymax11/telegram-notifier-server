const express = require('express');
const bodyParser = require('body-parser');

module.exports = class Server {
    constructor(bot, port) {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // parse application/json
        this.app.use(bodyParser.json());

        this.app.post('/messages', (req, res) => {
            const { message, chatid, username, group } = req.body;
            const sent = this.bot.sendMessage({ chatid, username, group }, message);
            if (sent) {
                res.status(200);
                return res.send();
            }

            res.status(404);
            return res.send();
        });

        this.app.get('/status', (req, res) => res.json(this.bot.getStatus()));

        this.app.listen(port, err => {
            if (err) {
                throw err;
            }

            console.log(`listening port ${port}`);
        });
        this.bot = bot;
    }
};
