const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')

const VALID_TOKEN = "bearer tcc-api"

class TutorInfoHandler extends PrivateHandler {

    constructor(container) {
        super(container, ['GET']);
    }

    async handle(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')

        let data = await persistence.collection('tutors').findOne({
            user: user._id
        })


        if (!data)
            throw  {status: 404, message: 'Incomplete registry'}

        return response
            .contentType('application/json')
            .send(JSON.stringify({
                "success": true,
                "data": data
            }))
    }

}

module.exports = TutorInfoHandler;