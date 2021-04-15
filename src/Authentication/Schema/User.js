module.exports = function (context) {
    return {
        properties: {
            email: {
                type: 'string',
                pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            },
            password: {
                type: 'password',
                application_id: context.get('app.configuration.application_id')
            },
            active: {
                type: 'string'
            }
        }
    }
}