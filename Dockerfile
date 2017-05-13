FROM node:alpine

MAINTAINER Cezar Luiz <cezarluiz.c@gmail.com>

ENV NODE_ENV development

RUN npm install pm2 -g --silent
RUN apk add --no-cache curl bash tar
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /src
WORKDIR /src

COPY app/package.json .
RUN yarn
COPY app/ .

EXPOSE 3000

CMD ["npm", "start"]
