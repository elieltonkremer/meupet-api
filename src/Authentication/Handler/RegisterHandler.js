const AbstractHandler = require('../../Server/Handler/AbstractHandler')

class RegisterHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.user')
        let data = await data_type.toJS(request.body, schema)
        return response
            .contentType('application/json')
            .send(await data_type.toJSON(data, schema))
    }
}

module.exports = RegisterHandler