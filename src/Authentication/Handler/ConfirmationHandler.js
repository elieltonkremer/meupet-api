const AbstractHandler = require('../../Server/Handler/AbstractHandler')
const mongo = require('mongodb')

const VALID_CONFIRMATION_CODE = "tcc-api"

class ConfirmationHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async handle(request, response) {
        const persistence = this.container.get('app.persistence')

        let confirmed = false

        try {
            let users = await persistence.collection('users').find({
                _id: mongo.ObjectId(request.query.code),
            })

            for await (let user of users) {
                await persistence.collection('users').updateOne({
                    _id: user._id,
                    status: 'pending'
                }, {
                    $set: {
                        status: 'active'
                    }
                })
                confirmed = true
            }
        } catch (e) {
            confirmed = false
        }


        return response
            .contentType('application/json')
            .send(JSON.stringify({
                success: confirmed,
                data: {
                    message: confirmed ? "account confirmed" : "invalid confirmation code",
                }
            }))
    }
}

module.exports = ConfirmationHandler