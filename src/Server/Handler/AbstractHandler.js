const {Request, Response} = require('express')

class AbstractHandler {

    constructor(container, methods = null) {
        this.container = container
        this.methods = methods || ['GET', 'POST', "PUT", "PATCH", "DELETE"]
    }

    /**
     * @abstract
     * @param {Request} request
     * @param {Response} response
     * @returns {Promise<void>}
     */
    async handle(request, response) {
        throw new Error('Please implement it!')
    }

}

module.exports = AbstractHandler