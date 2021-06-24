const { Container, ServiceResource, ParameterResource, GroupResource, StackContainer } = require("logos")


module.exports = new Container({
    'app.schema.account': new ParameterResource(require('./Account'))
})