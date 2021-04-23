# WebScrapper
## Requirements
- node v14
- hadoop v3.2.2
## Before start
In order to use hadoop as a storage system it needs to be started first and properly configured. 
This project stores scrapped web pages into /scrapper directory, so it needs to exist. You can create it by running
`hdfs dfs -mkdir ${env.HDFS_NAMESPACE}`. 
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
SENTRY_ON=boolean to use or not use sentry
PAGE_LOCATION=page to scrap
PAGE_PARSER=parser schema name
SURFER_SCHEDULE=cron value to schedule surfer job
```
## Usage
```
cp .env.dist .env
mkdir _cache
npm install
npm start
```