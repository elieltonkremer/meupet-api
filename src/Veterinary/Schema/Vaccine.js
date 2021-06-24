module.exports = {
    properties: {
        user: {type: 'string', required: true},
        pet: {type: 'string', required: true},
        name: {type: 'string', required: true},
        description: {type: 'string', required: true},
        date: {type: 'string', required: true, format: 'DD/MM/YYYY'}
    }
}