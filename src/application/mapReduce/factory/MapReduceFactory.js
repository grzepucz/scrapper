const MemesCategoriesMapReduce = require('./model/MemesCategoriesMR');

class MapReduceFactory {
    getFactory(action) {
        return new MemesCategoriesMapReduce();
    }
}

module.exports = MapReduceFactory;
