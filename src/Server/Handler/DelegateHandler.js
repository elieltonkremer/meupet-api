const AbstractContainer = require('logos/Context/AbstractContainer')
const AbstractHandler = require('./AbstractHandler')
const ValidationError = require('logos-schema/DataType/ValidationError')

class DelegateHandler extends AbstractHandler {

    /**
     * @param {AbstractContainer} container
     */
    constructor(container) {
        super(container);
        this._routes = null
    }

    /**
     * @returns {{check: Function<Promise>, handle: Function<Promise>}[]}
     */
    get routes() {
        const self = this;
        if (!self._routes) {
            console.log(self.container.get('groups.routes'))
            self._routes =  self.container.get('groups.routes').map(function(name) {
                return self.container.get(`app.routes.${name}`);
            })
        }
        return this._routes
    }

    /**
     * @param request
     * @param response
     * @returns {Promise<Response|void>}
     */
    async handle(request, response) {
        try {
            for (let route of this.routes) {
                console.log(await route.check(request))
                if (await route.check(request)) {
                    return await route.handle(request, response)
                }
            }
            throw {status: 404, message: 'not found'}
        } catch (e) {
            console.log(e)
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
