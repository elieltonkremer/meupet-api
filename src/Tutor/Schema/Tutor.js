module.exports = {
    properties: {
        user: {
            type: "string",
            required: true
        },
        full_name: {
            type: 'string',
            required: true
        },
        document: {
            type: 'string',
            pattern: /(\d{3}).(\d{3}).(\d{3})-(\d{2})/,
            required: true
        },
        birthday: {
            type: 'date',
            format: 'DD/MM/YYYY',
            required: true
        },
        pets: {
            type: "array",
            items: {
                type: "string"
            },
            default: function() {
                return []
            }
        }
    }
}