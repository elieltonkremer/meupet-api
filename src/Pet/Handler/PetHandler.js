const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')
const {ObjectId} = require('mongodb')


class PetHandler extends PrivateHandler {

    async handle(request, response) {
        let handle = this[request.method.toLowerCase()];
        if (handle) {
            return await this[request.method.toLowerCase()](request, response)
        } else {
            throw {status: 404, message: 'Not found'}
        }
    }

    async get(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.pet')
        if (request.params.id) {
            let pet = await persistence.collection('pets').findOne({
                _id: new ObjectId(request.params.id),
                user: user._id
            })
            return response
                .contentType('application/json')
                .send(JSON.stringify(await data_type.toJSON(pet, schema)))
        } else {
            let page = request.query.page || 1
            let limit = request.query.limit || 50
            let pets = await persistence.collection('pets')
                .find({
                    user: request.query.user ? new ObjectId(request.query.user) : user._id
                })
                .skip((page - 1) * limit)
                .limit(limit)

            let new_pets = []
            for await (let pet of pets) {
                new_pets.push(pet)
            }
            pets = new_pets

            console.log({pets})

            return response
                .contentType('application/json')
                .send(JSON.stringify(await Promise.all(Array.from(pets).map(async function(pet) {
                    return {
                        id: pet._id.toString(),
                        ...await data_type.toJSON(pet, schema)
                    }
                }))))
        }
    }

    async post(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.pet')

        let pet = await data_type.toJS({
            ...request.body,
            user: user._id
        }, schema)
        let message = null

        if (request.params.id) {
            await persistence.collection('pets').updateOne({
                _id: new ObjectId(request.params.id),
                user: user._id
            }, {
                $set: pet
            })
            message = 'pet updated'
        } else {
            await persistence.collection('pets').insertOne(pet)
            message = 'pet created'
        }
        return await response
            .contentType('application/json')
            .send(JSON.stringify({
                success: true,
                data: message
            }))
    }

    async delete(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let schema = this.container.get('app.schema.pet')

        let message = null
        if (request.params.id) {
            await persistence.collection('pets').deleteOne({
                user: user._id,
                _id: new ObjectId(request.params.id)
            })
            message = 'pet deleted'
        } else {
            await persistence.collection('pets').deleteMany({
                user: user._id,
                _id: {$in: (request.body.ids || []).map(function(id) {
                    return new ObjectId(id)
                })}
            })
            message = 'pets deleted'
        }
        return await response
            .contentType('application/json')
            .send(JSON.stringify({
                success: true,
                data: message
            }))
    }
}

module.exports = PetHandler;