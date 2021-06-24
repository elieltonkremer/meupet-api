const { Container, ServiceResource, ParameterResource, StackContainer } = require("logos")


module.exports = new Container({
    'app.schema.vaccine': new ParameterResource(require('./Vaccine')),
    'app.schema.vaccine_plan': new ParameterResource(require('./VaccinePlan')),
})