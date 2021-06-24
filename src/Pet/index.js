const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")
const RouteResource = require('../Server/Resource/RouteResource')


module.exports = {
    container: new StackContainer([
        new Container({
            'app.routes.account_pets': new RouteResource(
                '/pets/:id',
                new ServiceResource(
                    "./Pet/Handler/PetHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            ),
            'app.routes.account_pet': new RouteResource(
                '/pets/',
                new ServiceResource(
                    "./Pet/Handler/PetHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST', 'GET', 'DELETE']
            )
        }),
        require('./Schema')
    ])
}
