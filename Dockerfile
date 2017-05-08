FROM node:alpine

MAINTAINER Cezar Luiz <cezarluiz.c@gmail.com>

ENV NODE_ENV development

# RUN apk update && apk COPY g++ make python build-base
RUN npm install pm2 -g

RUN mkdir /src
WORKDIR /src

COPY app/package.json .
RUN npm install
COPY app/ .

EXPOSE 3000

CMD ["npm", "start"]
