const { Container, ServiceResource, ParameterResource, GroupResource, StackContainer } = require("logos")


module.exports = new Container({
    'app.schema.tutor': new ParameterResource(require('./Tutor'))
})