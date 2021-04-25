const MapReduceHandler = require('@infrastructure/storage/hadoop/handler/MapReduceHandler');
const ReadFileHandler = require('@infrastructure/storage/hadoop/handler/ReadFileHandler');

const action = 'MemesInCategory';

class MemesCategoriesMapReduce {
    constructor() {
        this.mapReduceHandler = MapReduceHandler;
        this.readFileHandler = ReadFileHandler;
    }

    run(domain) {
        return new Promise((resolve) => {
            this.mapReduceHandler.handle({ domain, action })
                .then((outputDir) => this.readFileHandler.handle(outputDir))
                .then((data) => {
                    console.log(data);
                    resolve(data);
                });
        }).then((data) => data);
    }
}

module.exports = MemesCategoriesMapReduce;
