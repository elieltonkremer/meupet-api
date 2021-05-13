const { Container, ServiceResource, ParameterResource, GroupResource, StackContainer } = require("logos")


module.exports = {
    container: new StackContainer([
        new Container({
            'app.http_handler.register-tutor': new ServiceResource(
                "./Tutor/Handler/RegisterHandler",
                [
                    '%context%'
                ]
            ),
            'app.http_handler.tutor-info': new ServiceResource(
                "./Tutor/Handler/TutorInfoHandler",
                [
                    '%context%'
                ]
            ),
        }),
        require('./Schema')
    ])
}

