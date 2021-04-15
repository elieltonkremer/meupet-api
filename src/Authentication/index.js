const { Container, ServiceResource, ParameterResource } = require("logos")


module.exports = {
    container: new Container({
        'app.data_type.password': new ServiceResource(
            './Authentication/DataType/PasswordDataType',
            [
                '%context%'
            ]
        ),
        'app.schema.user': new ParameterResource('./Authentication/Schema/User')
    })
}

