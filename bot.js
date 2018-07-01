const get = require('lodash/fp/get');
const reduce = require('lodash/fp/reduce');
const isEqual = require('lodash/fp/isEqual');
const pipe = require('lodash/fp/pipe');
const find = require('lodash/fp/find');

module.exports = class Bot {
    constructor(telegramBot, botFirstName = '', botUserName = '', state) {
        this.bot = telegramBot;
        this.botFirstName = botFirstName;
        this.botUserName = botUserName;
        if (state) {
            this.chats = state.chats;
            this.sent = state.sent;
        } else {
            this.chats = {};

            this.sent = {
                users: 0,
                groups: 0
            };
        }

        this.started = Date.now();

        this.bot.on('message', message => {
            const { id: chatid, username, title: group } = message.chat;

            this.chats[chatid] = {
                chatid,
                username,
                group
            };

            if (message.chat.type === 'private') {
                return this.bot.sendMessage(chatid, `chatid: ${chatid}\nusername: ${username}`);
            }

            if (message.chat.type === 'group') {
                if (
                    message.new_chat_member &&
                    message.new_chat_member.first_name === this.botFirstName &&
                    message.new_chat_member.username === this.botUserName
                ) {
                    return this.bot.sendMessage(chatid, `chatid: ${chatid}\ngroup: ${group}`);
                }

                if (message.group_chat_created === true) {
                    return this.bot.sendMessage(chatid, `chatid: ${chatid}\ngroup: ${group}`);
                }
            }
        });
    }

    sendMessage(to, message) {
        const field = to.chatid ? 'chatid' : to.username ? 'username' : 'group';
        const receiver = find(
            pipe(
                get(field),
                isEqual(to[field])
            ),
            this.chats
        );

        if (!receiver) {
            return false;
        }

        if (receiver.username) {
            this.sent.users += 1;
        } else {
            this.sent.groups += 1;
        }

        this.bot.sendMessage(receiver.chatid, message);

        return true;
    }

    getStatus() {
        return reduce(
            (acc, { username, group }) => {
                if (username) {
                    acc.users += 1;
                }
                if (group) {
                    acc.groups += 1;
                }
                return acc;
            },
            { groups: 0, users: 0, sent: this.sent, uptime: Date.now() - this.started },
            this.chats
        );
    }

    getState() {
        return {
            chats: this.chats,
            sent: this.sent
        };
    }
};
