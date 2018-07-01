FROM node:8-alpine
EXPOSE 80
WORKDIR /server

ADD bot.js index.js package.json server.js .npmrc /server/
RUN chmod 777 -R /server
RUN cd /server && yarn --prod

CMD [ "node", "/server/index.js" ]
