FROM node:10-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install --only=production

EXPOSE 3000
CMD [ "npm", "start" ]