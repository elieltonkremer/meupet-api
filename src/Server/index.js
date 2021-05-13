const { Container, ServiceResource, ParameterResource, GroupResource } = require("logos")


module.exports = {
    container: new Container({
        'groups.http_handlers': new GroupResource(/^app.http_handler./),
        'app.http_handler': new ServiceResource(
            "./Server/Handler/DelegateHandler",
            [
                '%context%'
            ]
        ),
        'app.command.http_server': new ServiceResource(
            './Server/Command/HttpServerCommand',
            [
                '%app.argument_parser%',
                '%context%'
            ]
        )
    })
}

