# WebScrapper
## Requirements
- node v14
- hadoop v3.2.2
## Before start
In order to use hadoop as a storage system it needs to be started first and properly configured. 
This project stores scrapped web pages into /scrapper directory, so it needs to exist. You can create it by running
`hdfs dfs -mkdir /scrapper`. 
Fetched pages before being put into hadoop are stored locally inside `_cache` directory so do not delete it. Files inside are deleted right after being stored into hdfs.
## Configuration
Configuration variables are stored inside `.env` file.
```
PORT=Your web application port
APP_NAME=Application-name
HDFS_BIN=path to your hdfs executable-hdfs
HDFS_NAMESPACE=directory inside hdfs system. If changed run command from Before start section with your value.
MONGO_USER=User to mongoDB
MONGO_PASSWORD=Password for mongoDB
MONGO_HOST=MongoDB host
MONGO_PROTOCOL=Mongo protocol
MONGO_DB=Collection schema name
SENTRY_DSN=url to sentry dsn
PAGE_LOCATION=page to scrap
PAGE_PARSER=parser schema name
```
## Parser
You can add your own parser like it is done in `src/domain/Article/parser/config/config.json` config file. Using pattern from `default` set.
Variables PAGE_PARSER and PAGE_LOCATION needs to be changed afterwards.
## Usage
```
cp .env.dist .env
mkdir _cache
npm install
npm start
```