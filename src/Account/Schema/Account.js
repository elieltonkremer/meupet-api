module.exports = {
    properties: {
        user: {
            type: "string",
            required: true
        },
        type: {
            type: 'string',
            required: true,
            choices: ['tutor', 'veterinary']
        },
        full_name: {
            type: 'string',
            required: true
        },
        documents: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {type: 'string', required: true},
                    value: {type: 'string', required: true}
                }
            }
        },
        birthday: {
            type: 'date',
            format: 'DD/MM/YYYY',
            required: true
        },
        addresses: {
            type: 'array',
            items: {
                type: "object",
                properties: {
                    postal_code: {type: 'string', max_length: 8, min_length: 8, required: true},
                    city: {type: 'string', required: true},
                    province: {type: 'string', required: true},
                    street: {type: 'string', required: true},
                    number: {type: 'string', required: true},
                    neighborhood: {type: 'string', required: true}
                }
            }
        }
    }
}