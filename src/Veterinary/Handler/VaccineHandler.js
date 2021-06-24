const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')
const {ObjectId} = require('mongodb')



class VaccinePlanHandler extends PrivateHandler {

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
        let schema = this.container.get('app.schema.vaccine')
        if (request.params.id) {
            let vaccine = await persistence.collection('vaccines').findOne({_id: new ObjectId(request.params.id)})
            return response
                .contentType('application/json')
                .send(JSON.stringify(await data_type.toJSON(vaccine, schema)))
        } else {
            let page = request.query.page || 1
            let limit = request.query.limit || 50
            let vaccines = await persistence.collection('vaccines')
                .find({})
                .skip((page - 1) * limit)
                .limit(limit)

            let new_vaccines = []
            for await (let vaccine of vaccines) {
                new_vaccines.push(vaccine)
            }
            vaccines = new_vaccines

            return response
                .contentType('application/json')
                .send(JSON.stringify(await Promise.all(Array.from(vaccines).map(async function (vaccine) {
                    return {
                        id: vaccine._id.toString(),
                        ...await data_type.toJSON(vaccine, schema)
                    }
                }))))
        }
    }

    async post(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.vaccine')

        let vaccine = await data_type.toJS({
            ...request.body,
            user: user._id
        }, schema)
        let pet = null
        try {
            pet = await persistence.collection('pets').findOne({
                _id: new ObjectId(vaccine.pet)
            })
            if (!pet)
                throw {status: 404, message: {"pet": "not found"}}
        } catch (e) {
            throw {status: 404, message: {"pet": "not found"}}
        }
        let message = null

        if (request.params.id) {
            await persistence.collection('vaccines').updateOne({
                _id: new ObjectId(request.params.id),
                user: user._id
            }, {
                $set: {
                    ...vaccine,
                    pet: pet._id
                }
            })
            message = 'vaccine updated'
        } else {
            await persistence.collection('vaccines').insertOne({...vaccine, pet: pet._id})
            message = 'vaccine created'
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

        let message = null
        if (request.params.id) {
            await persistence.collection('vaccines').deleteOne({
                user: user._id,
                _id: new ObjectId(request.params.id)
            })
            message = 'vaccine deleted'
        } else {
            await persistence.collection('vaccines').deleteMany({
                user: user._id,
                _id: {
                    $in: (request.body.ids || []).map(function (id) {
                        return new ObjectId(id)
                    })
                }
            })
            message = 'vaccines deleted'
        }
        return await response
            .contentType('application/json')
            .send(JSON.stringify({
                success: true,
                data: message
            }))
    }
}

module.exports = VaccinePlanHandler