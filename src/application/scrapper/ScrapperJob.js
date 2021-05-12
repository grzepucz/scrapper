/**
 *
 */
class ScrapperJob {
    /**
     *
     * @param response
     * @param Parser
     * @param repository
     */
    constructor({ response, parser: Parser, repository }) {
        this.response = response;
        this.repository = repository;
        this.parser = new Parser();
    }

    /**
     *
     * @returns {Promise<*>}
     */
    run() {
        return this.parser.parse(this.response)
            .then((data) => this.repository.saveAll(data))
            .then((data) => data);
    }
}

module.exports = ScrapperJob;
