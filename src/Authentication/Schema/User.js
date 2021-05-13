module.exports = {
    properties: {
        _id: {
            type: 'string'
        },
        email: {
            type: 'string',
            required: true,
            pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        },
        password: {
            type: 'password',
            required: true,
            application_id: "tcc"
        },
        type: {
            type: "string",
            required: true,
            choices: ['tutor', 'veterinary', 'admin']
        },
        status: {
            type: 'string',
            default: function(context) {
                return "pending"
            }
        }
    }
}