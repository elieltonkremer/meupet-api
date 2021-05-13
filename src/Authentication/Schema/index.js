const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")


module.exports = new Container({
    'app.schema.user': new ParameterResource(require('./User')),
})