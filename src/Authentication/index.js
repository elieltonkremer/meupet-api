const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")


module.exports = {
    container: new StackContainer([
        new Container({
            'app.configuration.jwt_secret': new ParameterResource('tcc-api'),
            'app.data_type.password': new ServiceResource(
                './Authentication/DataType/PasswordDataType',
                [
                    '%context%'
                ]
            ),
            'app.http_handler.register': new ServiceResource(
                "./Authentication/Handler/RegisterHandler",
                [
                    '%context%'
                ]
            ),
            'app.http_handler.login': new ServiceResource(
                "./Authentication/Handler/LoginHandler",
                [
                    '%context%'
                ]
            ),
            'app.http_handler.confirmation': new ServiceResource(
                "./Authentication/Handler/ConfirmationHandler",
                [
                    '%context%'
                ]
            ),
        }),
        require('./Schema')
    ])
}

