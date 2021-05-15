const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

const VALID_TOKEN = "bearer tcc-api"

class TutorInfoHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async handle(request, response) {
        let user = await this.resolve_user(request)
        return response
            .contentType('application/json')
            .send(JSON.stringify({
                "success": true,
                "data": {
                    "user": user._id,
                    "full_name": "elielton kremer",
                    "document": "097.871.469-50",
                    "birthday": "23/01/1996",
                    "pets": []
                }
            }))
    }

}

module.exports = TutorInfoHandler;