module.exports = {
    properties: {
        user: {type: 'string', required: true},
        name: {type: 'string', required: true},
        description: {type: 'string', required: true},
        price: {type: 'number', required: true},
        pet_types: {
            type: 'array',
            items: {
                type: "string"
            }
        }
    }
}