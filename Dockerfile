FROM node:14-stretch-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y git openssh-client && \
    groupadd --gid 10000 scrapper && \
    useradd --uid 10000 --gid scrapper --shell /bin/bash --create-home scrapper && \
    chown -R scrapper:scrapper ./

USER provider

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
