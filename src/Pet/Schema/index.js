const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")


module.exports = new Container({
    'app.schema.pet': new ParameterResource(require('./Pet'))
})