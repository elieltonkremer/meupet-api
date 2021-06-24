const { Container, ServiceResource, ParameterResource, GroupResource, StackContainer } = require("logos")
const RouteResource = require('../Server/Resource/RouteResource')



module.exports = {
    container: new StackContainer([
        new Container({
            'app.routes.register-account': new RouteResource(
                '/account',
                new ServiceResource(
                    "./Account/Handler/AccountRegisterHandler",
                    [
                        '%context%'
                    ]
                ),
                ["POST"]
            ),
            'app.routes.account-info': new RouteResource(
                '/account',
                new ServiceResource(
                    "./Account/Handler/AccountInfoHandler",
                    [
                        '%context%'
                    ]
                ),
                ['GET']
            )
        }),
        require('./Schema')
    ])
}

