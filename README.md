# Telegram Notifier Server

## Overview

**Telegram Notifier Server** is a telegram bot plus simple nodejs express server. It provides a REST API to send messages via bot to users and groups.

It allows to easy integrate your notification systems with telegram bot. Just make a curl request to make a notification to some user or group.

* Create bot
* Run **Telegram Notifier Server**
* Chat something to your bot or create/invite bot to group
* Send POST request to **Telegram Notifier Server** to send a message via bot
* PROFIT!

## Examples



### Run as docker

```bash
docker run -it --env PORT=8000 -p 8000:8000 --env TELEGRAM_TOKEN='your_token' --env TELEGRAM_FIRSTNAME=bot-name --env TELEGRAM_USERNAME=BotUserName msosnov/telegram-notifier-server
```

### Run as nodejs service

**It doesn't work for now!**

```bash
PORT=8000 TELEGRAM_TOKEN='your_token' TELEGRAM_FIRSTNAME=bot-name TELEGRAM_USERNAME=BotUserName telegram-notifier-server
```

### Curl requests to server

#### Post message to user by username

```bash
curl -X POST localhost:8000/messages -H "Content-Type: application/json"  --data '{"username":"your-tm-name","message":"your-message"}'
```

#### Post message to group by group title

```bash
curl -X POST localhost:8000/messages -H "Content-Type: application/json"  --data '{"group":"awesome-devops","message":"your-message"}'
```


#### Post message to chatid

```bash
curl -X POST localhost:8000/messages -H "Content-Type: application/json"  --data '{"chatid": 123456789,"message":"your-message"}'
```

#### Current status

```bash
curl localhost:8000/status
```