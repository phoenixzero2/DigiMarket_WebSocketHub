# Base image for docker image:
FROM node:16.17.1

#workdir for app directory
WORKDIR /usr/src/DigiMarket_WebSocketHub

#copy package.json to image
COPY package*.json ./

#Update container
RUN apt-get update

# Update to latest NPM version:
RUN npm install -g npm@9.7.2

#install Python and RobotJS requirements
RUN apt update -y && apt install -y libxtst-dev libpng++-dev make gcc

#Install all dependencies in docker image
RUN npm install

#Copy all code contents to coker image
COPY . .

#expose port used by socket hub
EXPOSE 4001

#Run Socket hub web service
CMD ["node","app.js"]