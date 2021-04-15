const { Container, ServiceResource, ParameterResource } = require("logos")


module.exports = {
    container: new Container({
        'app.command.http_server': new ServiceResource(
            './Server/Command/HttpServerCommand',
            [
                '%app.argument_parser%',
                '%context%'
            ]
        )
    })
}

