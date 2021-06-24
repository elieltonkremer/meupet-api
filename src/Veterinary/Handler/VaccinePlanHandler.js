const PrivateHandler = require('../../Authentication/Handler/PrivateHandler')


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
        let schema = this.container.get('app.schema.vaccine_plan')
        if (request.params.id) {
            let vaccine_plan = await persistence.collection('vaccine_plans').findOne({_id: new ObjectId(request.params.id)})
            return response
                .contentType('application/json')
                .send(JSON.stringify(await data_type.toJSON(vaccine_plan, schema)))
        } else {
            let page = request.query.page || 1
            let limit = request.query.limit || 50
            let vaccine_plans = await persistence.collection('vaccine_plans')
                .find({})
                .skip((page - 1) * limit)
                .limit(limit)

            let new_vaccine_plans = []
            for await (let vaccine_plan of vaccine_plans) {
                new_vaccine_plans.push(vaccine_plan)
            }
            vaccine_plans = new_vaccine_plans

            return response
                .contentType('application/json')
                .send(JSON.stringify(await Promise.all(Array.from(vaccine_plans).map(async function (vaccine_plan) {
                    return {
                        id: vaccine_plan._id.toString(),
                        ...await data_type.toJSON(vaccine_plan, schema)
                    }
                }))))
        }
    }

    async post(request, response) {
        let user = await this.resolve_user(request)
        let persistence = this.container.get('app.persistence')
        let data_type = this.container.get('app.data_type.object')
        let schema = this.container.get('app.schema.vaccine_plan')

        let vaccine_plan = await data_type.toJS({
            ...request.body,
            user: user._id
        }, schema)
        let message = null

        if (request.params.id) {
            await persistence.collection('vaccine_plans').updateOne({
                _id: new ObjectId(request.params.id),
                user: user._id
            }, {
                $set: vaccine_plan
            })
            message = 'vaccine plan updated'
        } else {
            await persistence.collection('vaccine_plans').insertOne(vaccine_plan)
            message = 'vaccine plan created'
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
            await persistence.collection('vaccine_plans').deleteOne({
                user: user._id,
                _id: new ObjectId(request.params.id)
            })
            message = 'vaccine plan deleted'
        } else {
            await persistence.collection('vaccine_plans').deleteMany({
                user: user._id,
                _id: {
                    $in: (request.body.ids || []).map(function (id) {
                        return new ObjectId(id)
                    })
                }
            })
            message = 'vaccine plans deleted'
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