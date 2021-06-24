const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

class AccountRegisterHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        let user = await this.resolve_user(request)
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.account')
        let persistence = this.container.get('app.persistence')

        let account = await persistence.collection('accounts').findOne({user: user._id})
        let message = null
        let data = await data_type.toJS({
            ...request.body,
            user: user._id
        }, {...schema, partial: true})

        if (account) {
            await persistence.collection('accounts').updateOne({
                _id: account._id
            }, {$set: data})
            message = 'Account successful updated'
        } else {
            await persistence.collection('accounts').insertOne(data)
            message = 'Account successful registered'
        }

        return response
            .contentType('application/json')
            .send({
                success: true,
                data: message
            })
    }
}

module.exports = AccountRegisterHandler