const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")
const RouteResource = require('../Server/Resource/RouteResource')


module.exports = {
    container: new StackContainer([
        new Container({
            'app.configuration.jwt_secret': new ParameterResource('tcc-api'),
            'app.data_type.boolean': new ServiceResource(
                'logos-schema/DataType/NativeDataType',
                [
                    '%context%'
                ]
            ),
            'app.data_type.password': new ServiceResource(
                './Authentication/DataType/PasswordDataType',
                [
                    '%context%'
                ]
            ),
            'app.data_type.email': new ServiceResource(
                './Authentication/DataType/EmailDataType',
                [
                    '%context%'
                ]
            ),
            "app.routes.register": new RouteResource(
                '/auth/register',
                new ServiceResource(
                    "./Authentication/Handler/RegisterHandler",
                    [
                        '%context%'
                    ],
                    ['POST']
                ),
            ),
            'app.routes.login': new RouteResource(
                '/auth/login',
                new ServiceResource(
                    "./Authentication/Handler/LoginHandler",
                    [
                        '%context%'
                    ]
                ),
                ["POST"]
            ),
            'app.routes.confirm': new RouteResource(
              '/auth/confirmation',
                new ServiceResource(
                    "./Authentication/Handler/ConfirmationHandler",
                    [
                        '%context%'
                    ]
                ),
                ['POST']
            )
        }),
        require('./Schema')
    ])
}
