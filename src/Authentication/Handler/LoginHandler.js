const AbstractHandler = require('../../Server/Handler/AbstractHandler')
const { sign } = require('jsonwebtoken')


class LoginHandler extends AbstractHandler {

    constructor(container) {
        super(container, ['POST']);
    }

    async handle(request, response) {
        const self = this;
        const persistence = this.container.get('app.persistence')
        const data_type = this.container.get('app.data_type.object')


        let data = await data_type.toJS(request.body, {
            properties: {
                email: {
                    type: 'email',
                    required: true
                },
                password: {
                    type: 'password',
                    required: true,
                    application_id: 'tcc'
                }
            }
        })

        let users = await persistence.collection('users').find({
            email: data.email,
            password: data.password,
            status: 'active'
        })

        for await (let user of users) {
            return response
                .contentType('application/json')
                .send(JSON.stringify({
                  success: true,
                  data: {
                    token: await new Promise(function (resolve, reject) {
                        sign({
                            user: user._id
                        }, self.container.get('app.configuration.jwt_secret'),  { algorithm: 'HS256'}, function(err, data) {
                            if (err)
                                return reject(err)
                            resolve(data)
                        })
                    })
                  }
                }))

        }

        throw {status: 402, message: 'Incorrect login data'}

    }
}

module.exports = LoginHandler
