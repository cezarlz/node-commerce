FROM node:7

EXPOSE 3000

RUN mkdir /src
WORKDIR /src
ADD ./app .
RUN npm install
CMD npm run dev
