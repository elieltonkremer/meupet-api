const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

class RegisterHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        let data_type = this.container.get('app.data_type.object')
        let user = await this.resolve_user(request)
        let schema = this.container.get('app.schema.tutor')
        let persistence = this.container.get('app.persistence')

        if (user.type.indexOf('tutor') === -1)
            throw {status: 404, message: "This is not tutor account"}

        if (await persistence.collection('tutors').findOne({user: user._id}))
            throw {status: 402, message: "Tutor already registered"}

        let data = await data_type.toJS({
            ...request.body,
            user: user._id
        }, schema)

        let status = await persistence.collection('tutors').insertOne(data)

        return response
            .contentType('application/json')
            .send({
                success: true,
                data: 'Tutor successful registered'
            })
    }
}

module.exports = RegisterHandler