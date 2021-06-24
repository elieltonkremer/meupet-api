const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

const VALID_TOKEN = "bearer tcc-api"

class AccountInfoHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async handle(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.account')

        let data = await persistence.collection('accounts').findOne({
            user: user._id
        })


        if (!data)
            throw  {status: 404, message: 'Incomplete registry'}

        return response
            .contentType('application/json')
            .send(JSON.stringify({
                "success": true,
                "data": await data_type.toJSON(data, schema)
            }))
    }

}

module.exports = AccountInfoHandler;