const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

class RegisterHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        let data_type = this.container.get('app.data_type.object')
        let user = await this.resolve_user(request)
        let schema = this.container.get('app.schema.tutor')
        let data = await data_type.toJS({
            ...request.body,
            user: user._id
        }, schema)
        return response
            .contentType('application/json')
            .send({
                success: true,
                data: await data_type.toJSON(data, schema)
            })
    }
}

module.exports = RegisterHandler