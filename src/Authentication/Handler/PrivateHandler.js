const AbstractHandler = require('../../Server/Handler/AbstractHandler')
const { Request } = require('express')
const { verify } = require('jsonwebtoken')
const mongo = require('mongodb')


/**
 * @abstract
 */
class PrivateHandler extends AbstractHandler {

    /**
     * @param { Request } request
     * @throws Error
     * @return {Promise<{}>}
     */
    async resolve_user(request) {
        const self = this
        if (!request.headers.authorization)
            throw {status: 401, message: {success: false, data: {message: "login required"}}}

        let token = await new Promise(function (resolve, reject) {
            verify(request.headers.authorization.replace('Bearer ', ''), self.container.get('app.configuration.jwt_secret'), function (err, data) {
                if (err)
                    return reject({status: 401, message: "invalid token"})
                resolve(data)
            })
        })

        const persistence = this.container.get('app.persistence')

        let user_id = null

        try {
            user_id = mongo.ObjectId(token.user)
        } catch (e) {
            user_id = token.user
        }

        let users = await persistence.collection('users').find({
            _id: user_id,
            status: 'active'
        })

        for await (let user of users ) {
            return user
        }

        throw {status: 401, message: "invalid token"}
    }

}

module.exports = PrivateHandler