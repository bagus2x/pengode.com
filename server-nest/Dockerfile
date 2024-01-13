FROM node:20.11.0

WORKDIR /app

COPY package.json /app

COPY yarn.lock /app

RUN yarn

COPY . /app

CMD ["yarn", "start:dev"]