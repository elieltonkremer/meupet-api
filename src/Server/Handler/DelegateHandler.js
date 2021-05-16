const AbstractContainer = require('logos/Context/AbstractContainer')
const AbstractHandler = require('./AbstractHandler')
const ValidationError = require('logos-schema/DataType/ValidationError')

class DelegateHandler extends AbstractHandler {

    /**
     * @param {AbstractContainer} container
     */
    constructor(container) {
        super(container);
    }

    /**
     * @return {AbstractHandler}
     */
    resolve_handler(name) {
        if (!this.container.has(`app.http_handler.${name}`))
            throw {
                status: 404,
                message: 'invalid handler name',
            }
        return this.container.get(`app.http_handler.${name}`)
    }


    async handle(request, response) {
        try {
            const handler = this.resolve_handler(request.params.handler)
            if (Array.isArray(handler.methods) && !handler.methods.includes(request.method))
                throw {status: 405, message: `method not allowed for "${request.params.handler}" handler`}

            return await handler.handle(request, response)

        } catch (e) {
            if (e instanceof ValidationError)
                return response
                    .contentType('application/json')
                    .status(402)
                    .send(JSON.stringify({
                        success: false,
                        data: e.message
                    }))
            if (!e.message) {
              console.error(e)
            }
            return response
                .contentType('application/json')
                .status(e.status || 500)
                .send(JSON.stringify({
                    success: false,
                    data: e.message || e.toString()
                }))
        }
    }
}

module.exports = DelegateHandler
