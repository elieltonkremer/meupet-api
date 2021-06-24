const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")
const RouteResource = require('../Server/Resource/RouteResource')


module.exports = {
    container: new StackContainer([
        new Container({
            'app.routes.vaccine_plan': new RouteResource(
                '/vaccine-plans/:id',
                new ServiceResource(
                    "./Veterinary/Handler/VaccinePlanHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            ),
            'app.routes.vaccine_plans': new RouteResource(
                '/vaccine-plans/',
                new ServiceResource(
                    "./Veterinary/Handler/VaccinePlanHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            ),
            'app.routes.vaccine': new RouteResource(
                '/vaccines/:id',
                new ServiceResource(
                    "./Veterinary/Handler/VaccineHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            ),
            'app.routes.vaccines': new RouteResource(
                '/vaccines/',
                new ServiceResource(
                    "./Veterinary/Handler/VaccineHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            ),
        }),
        require('./Schema')
    ])
}
