const AbstractHandler = require('../../Server/Handler/AbstractHandler')

const VALID_TOKEN = "bearer tcc-api"

class TutorInfoHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async resolve_user(request) {
        if (request.headers.authorization !== VALID_TOKEN) {
            throw {status: 401, message: 'user is not tutor'}
        }
        return {
            "email": "elielton@gmail.com",
            "type": [
                "tutor"
            ],
            "status": "pending"
        }
    }

    async handle(request, response) {
        let user = await this.resolve_user(request)
        return response
            .contentType('application/json')
            .send(JSON.stringify({
                "success": true,
                "data": {
                    "user": "id-do-usuario",
                    "full_name": "elielton kremer",
                    "document": "097.871.469-50",
                    "birthday": "23/01/1996",
                    "pets": []
                }
            }))
    }

}

module.exports = TutorInfoHandler;