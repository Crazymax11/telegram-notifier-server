const Bot = require('../bot.js');
const TelegramBot = require('../__mocks__/telegramBot.js');
/* eslint-disable no-new */
describe('Bot', () => {
    it('should run', () => {
        new Bot(new TelegramBot());
    });
    describe('private messages', () => {
        it('should answer to user his chatid and username', () => {
            const TelegramBotMock = new TelegramBot();
            new Bot(TelegramBotMock);
            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(
                message.chat.id,
                `chatid: ${message.chat.id}\nusername: ${message.from.username}`
            );
        });
    });
    describe('groups', () => {
        it('If group created with bot, should send message to the group', () => {
            const TelegramBotMock = new TelegramBot();
            new Bot(TelegramBotMock);
            const message = TelegramBot.createGroupCreation();
            TelegramBotMock.emit('message', message);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(
                message.chat.id,
                `chatid: ${message.chat.id}\ngroup: ${message.chat.title}`
            );
        });
        it('If bot know his name and bot is invited to group should send message to the group', () => {
            const message = TelegramBot.createGroupInvitation();
            const TelegramBotMock = new TelegramBot();
            new Bot(
                TelegramBotMock,
                message.new_chat_member.first_name,
                message.new_chat_member.username
            );
            TelegramBotMock.emit('message', message);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(
                message.chat.id,
                `chatid: ${message.chat.id}\ngroup: ${message.chat.title}`
            );
        });

        it('If bot does not know his name and bot is invited to group should not send message to the group', () => {
            const message = TelegramBot.createGroupInvitation();
            const TelegramBotMock = new TelegramBot();
            new Bot(TelegramBotMock);
            TelegramBotMock.emit('message', message);
            expect(TelegramBotMock.sendMessage).not.toBeCalled();
        });
    });

    describe('sendMessage', () => {
        it('should send message by chatid', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(message.from.id, 'Привет!');
        });
        it('should send message by username', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            expect(bot.sendMessage({ username: message.from.username }, 'Привет!')).toBe(true);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(message.from.id, 'Привет!');
        });
        it('should send message by group', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createGroupCreation();
            TelegramBotMock.emit('message', message);
            expect(bot.sendMessage({ group: message.chat.title }, 'Привет!')).toBe(true);
            expect(TelegramBotMock.sendMessage).toBeCalledWith(message.chat.id, 'Привет!');
        });
        it('should send message with pririty chatid => username => group', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const privateMessage = TelegramBot.createPrivateMessage();
            const privateMessage2 = TelegramBot.createPrivateMessage();
            const groupMessage = TelegramBot.createGroupMessage();
            TelegramBotMock.emit('message', privateMessage);
            TelegramBotMock.emit('message', privateMessage2);
            TelegramBotMock.emit('message', groupMessage);

            expect(
                bot.sendMessage(
                    {
                        chatid: privateMessage.chat.id,
                        group: groupMessage.chat.title,
                        username: privateMessage2.chat.username
                    },
                    'Привет!'
                )
            ).toBe(true);

            expect(TelegramBotMock.sendMessage).toBeCalledWith(privateMessage.chat.id, 'Привет!');

            expect(
                bot.sendMessage(
                    {
                        group: groupMessage.chat.title,
                        username: privateMessage2.chat.username
                    },
                    'Привет!'
                )
            ).toBe(true);

            expect(TelegramBotMock.sendMessage).toBeCalledWith(privateMessage2.chat.id, 'Привет!');

            expect(
                bot.sendMessage(
                    {
                        group: groupMessage.chat.title
                    },
                    'Привет!'
                )
            ).toBe(true);

            expect(TelegramBotMock.sendMessage).toBeCalledWith(groupMessage.chat.id, 'Привет!');
        });

        it('should not send message by chatid if chatid is unknown', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            TelegramBotMock.sendMessage.mockReset();
            expect(bot.sendMessage({ chatid: message.from.id + 1 }, 'Привет!')).toBe(false);

            expect(TelegramBotMock.sendMessage).not.toBeCalled();
        });

        it('should not send message by username if username is unknown', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            TelegramBotMock.sendMessage.mockReset();
            expect(bot.sendMessage({ username: `${message.from.username}1` }, 'Привет!')).toBe(
                false
            );
            expect(TelegramBotMock.sendMessage).not.toBeCalled();
        });

        it('should not send message by group if group is unknown', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createGroupCreation();
            TelegramBotMock.emit('message', message);
            TelegramBotMock.sendMessage.mockReset();
            expect(bot.sendMessage({ group: `${message.chat.title}1` }, 'Привет!')).toBe(false);
            expect(TelegramBotMock.sendMessage).not.toBeCalled();
        });

        it('should not send message by chatid and username, if chatid is unknown', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');

            TelegramBotMock.emit('message', message);
            TelegramBotMock.sendMessage.mockReset();
            expect(
                bot.sendMessage(
                    { chatid: `${message.from.chatid}1`, username: message.from.username },
                    'Привет!'
                )
            ).toBe(false);
            expect(TelegramBotMock.sendMessage).not.toBeCalled();
        });
    });

    describe('getStatus', () => {
        it('should return actual status', () => {
            const TelegramBotMock = new TelegramBot();
            const bot = new Bot(TelegramBotMock);

            const message = TelegramBot.createPrivateMessage('/start');
            TelegramBotMock.emit('message', message);
            expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
            expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
            expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
            expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);

            const groupMessage1 = TelegramBot.createGroupCreation();
            const groupMessage2 = TelegramBot.createGroupCreation();
            TelegramBotMock.emit('message', groupMessage1);
            TelegramBotMock.emit('message', groupMessage2);
            expect(bot.sendMessage({ chatid: groupMessage2.chat.id }, 'Привет!')).toBe(true);

            expect(bot.getStatus()).toMatchObject({
                groups: 2,
                users: 1,
                sent: {
                    users: 4,
                    groups: 1
                }
            });

            expect(bot.getStatus().uptime).toBeGreaterThanOrEqual(1);
        });
    });
    it('should store and restore a state', () => {
        const TelegramBotMock = new TelegramBot();
        const bot = new Bot(TelegramBotMock);

        const message = TelegramBot.createPrivateMessage('/start');
        TelegramBotMock.emit('message', message);
        expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
        expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
        expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);
        expect(bot.sendMessage({ chatid: message.from.id }, 'Привет!')).toBe(true);

        const groupMessage1 = TelegramBot.createGroupCreation();
        const groupMessage2 = TelegramBot.createGroupCreation();
        TelegramBotMock.emit('message', groupMessage1);
        TelegramBotMock.emit('message', groupMessage2);
        expect(bot.sendMessage({ chatid: groupMessage2.chat.id }, 'Привет!')).toBe(true);

        expect(bot.getStatus()).toMatchObject({
            groups: 2,
            users: 1,
            sent: {
                users: 4,
                groups: 1
            }
        });

        expect(bot.getStatus().uptime).toBeGreaterThanOrEqual(1);

        const state = bot.getState();
        const newBot = new Bot(TelegramBotMock, '', '', state);
        expect(bot.sendMessage({ chatid: groupMessage2.chat.id }, 'Привет!')).toBe(true);
        expect(newBot.getStatus()).toMatchObject({
            groups: 2,
            users: 1,
            sent: {
                users: 4,
                groups: 2
            }
        });

        expect(newBot.getStatus().uptime).toBeLessThan(bot.getStatus().uptime);
    });
});
/* eslint-enable no-new */
