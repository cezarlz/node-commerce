FROM node:alpine

ENV NODE_ENV development

# RUN apk update && apk add g++ make python build-base
RUN npm install pm2 -g

RUN mkdir /src
WORKDIR /src

ADD app/package.json .
RUN npm install

EXPOSE 3000

CMD npm start
