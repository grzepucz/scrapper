class ScrapperJob {
    constructor({ response, parser: Parser, repository }) {
        this.response = response;
        this.repository = repository;
        this.parser = new Parser();
    }

    run() {
        return this.parser.parse(this.response)
            .then((data) => this.repository.saveAll(data))
            .then((data) => data);
    }
}

module.exports = ScrapperJob;
