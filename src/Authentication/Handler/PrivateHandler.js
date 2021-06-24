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
     * @param { Boolean } pending
     * @throws Error
     * @return {Promise<{}>}
     */
    async resolve_user(request, pending= false) {
        const self = this
        if (!request.headers.authorization)
            throw {status: 401, message: 'login required'}

        let token = await new Promise(function (resolve, reject) {
            console.log(request.headers.authorization)
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

        let status = ['active']

        if (pending)
            status.push('pending')

        let user = await persistence.collection('users').findOne({
            _id: user_id,
            status: {$in: status}
        })

        if (user && (user.status === 'active' || pending) ) {
            return user
        }

        throw {status: 401, message: "invalid token"}
    }

}

module.exports = PrivateHandler