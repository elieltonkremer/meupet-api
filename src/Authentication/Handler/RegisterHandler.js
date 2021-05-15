const AbstractHandler = require('../../Server/Handler/AbstractHandler')

class RegisterHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.user')
        let data = await data_type.toJS(request.body, schema)
        let persistence = this.container.get('app.persistence')

        let users = await persistence.collection('users').find({
            email: data.email
        })

        for await (let user of users) {
            throw {status: 402, message: {email: 'Email already registered'}}
        }

        let result = await persistence.collection('users').insertOne(data)

        return response
            .contentType('application/json')
            .send({
                'success': true,
                'data': {
                    "message": "user successful registered",
                    "confirmation_code":  result.insertedId
                }
            })
    }
}

module.exports = RegisterHandler