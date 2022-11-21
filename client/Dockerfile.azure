FROM node:alpine

EXPOSE 80

RUN mkdir app

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --omit=dev

COPY ./.next ./.next

CMD [ "npm", "start" ]