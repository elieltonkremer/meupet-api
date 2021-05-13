const AbstractHandler = require('../../Server/Handler/AbstractHandler')

const VALID_CONFIRMATION_CODE = "tcc-api"

class ConfirmationHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async handle(request, response) {
        const IS_VALID_CODE = request.query.code === VALID_CONFIRMATION_CODE
        return response
            .contentType('application/json')
            .send(JSON.stringify({
                success: IS_VALID_CODE,
                message: IS_VALID_CODE ? "account confirmed" : "invalid confirmation code"
            }))
    }
}

module.exports = ConfirmationHandler