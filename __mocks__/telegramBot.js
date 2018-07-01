const faker = require('faker');
const EventEmitter = require('events');

class Bot extends EventEmitter {
    constructor() {
        super();
        this.sendMessage = jest.fn();
    }

    onText(regexp, callback) {
        this.on('message', msg => {
            const matches = msg.text.match(regexp);
            if (matches) {
                callback(msg, matches);
            }
        });
    }
}

Bot.createPrivateMessage = function createPrivateMessage(text) {
    const chatid = faker.random.number();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();
    return {
        chat: {
            id: chatid,
            first_name: firstName,
            last_name: lastName,
            username,
            type: 'private'
        },
        message_id: faker.random.number(),
        from: {
            id: chatid,
            first_name: firstName,
            last_name: lastName,
            username,
            is_bot: false,
            language_code: 'ru-RU'
        },
        date: Date.now(),
        text
    };
};

Bot.createGroupCreation = function createGroupCreation() {
    const chatid = faker.random.number();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();
    return {
        chat: {
            id: chatid,
            title: faker.internet.userName(),
            type: 'group'
        },
        message_id: faker.random.number(),
        from: {
            id: chatid,
            first_name: firstName,
            last_name: lastName,
            username,
            is_bot: false,
            language_code: 'ru-RU'
        },
        date: Date.now(),
        group_chat_created: true
    };
};

Bot.createGroupMessage = function createGroupMessage(text) {
    const chatid = faker.random.number();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();
    return {
        chat: {
            id: chatid,
            title: faker.internet.userName(),
            type: 'group'
        },
        message_id: faker.random.number(),
        from: {
            id: chatid,
            first_name: firstName,
            last_name: lastName,
            username,
            is_bot: false,
            language_code: 'ru-RU'
        },
        date: Date.now(),
        text
    };
};

Bot.createGroupInvitation = function createGroupInvitation() {
    const chatid = faker.random.number();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();

    const newChatParticipant = {
        id: faker.random.number(),
        is_bot: true,
        first_name: `${faker.internet.userName()}-bot`,
        username: `${faker.internet.userName()}Bot`
    };
    return {
        chat: {
            id: chatid,
            title: faker.internet.userName(),
            type: 'group'
        },
        message_id: faker.random.number(),
        from: {
            id: chatid,
            first_name: firstName,
            last_name: lastName,
            username,
            is_bot: false,
            language_code: 'ru-RU'
        },
        date: Date.now(),
        new_chat_participant: newChatParticipant,
        new_chat_member: newChatParticipant,
        new_chat_members: [newChatParticipant]
    };
};

module.exports = Bot;

// Message formats

/* eslint-disable multiline-comment-style */
/* 
{ message_id: 15,
  from:
   { id: 181886827,
     is_bot: false,
     first_name: 'Maxim',
     last_name: 'Sosnov',
     username: 'crazymax101',
     language_code: 'ru-RU' },
  chat:
   { id: 181886827,
     first_name: 'Maxim',
     last_name: 'Sosnov',
     username: 'crazymax101',
     type: 'private' },
  date: 1528639141,
  text: '/help',
  entities: [ { offset: 0, length: 5, type: 'bot_command' } ] 
}
  
*/

/* group message 
{ message_id: 53,
  from:
   { id: 181886827,
     is_bot: false,
     first_name: 'Maxim',
     last_name: 'Sosnov',
     username: 'crazymax101',
     language_code: 'ru-RU' },
  chat:
   { id: -310747991,
     title: '11',
     type: 'group',
     all_members_are_administrators: true },
  date: 1530373687,
  text: '/start',
  entities: [ { offset: 0, length: 6, type: 'bot_command' } ] }

*/

/* group invite

{ message_id: 47,
  from:
   { id: 181886827,
     is_bot: false,
     first_name: 'Maxim',
     last_name: 'Sosnov',
     username: 'crazymax101',
     language_code: 'ru-RU' },
  chat:
   { id: -310747991,
     title: '11',
     type: 'group',
     all_members_are_administrators: true },
  date: 1530373553,
  new_chat_participant:
   { id: 616459328,
     is_bot: true,
     first_name: 'n1-status-bot',
     username: 'N1StatusBot' },
  new_chat_member:
   { id: 616459328,
     is_bot: true,
     first_name: 'n1-status-bot',
     username: 'N1StatusBot' },
  new_chat_members:
   [ { id: 616459328,
       is_bot: true,
       first_name: 'n1-status-bot',
       username: 'N1StatusBot' } ] }
*/

/* eslint-enable multiline-comment-style */
