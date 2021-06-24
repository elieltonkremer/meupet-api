const AbstractResource = require('logos/Context/Resource/AbstractResource');
const ServiceResource = require('logos/Context/Resource/ServiceResource');
const UrlPattern = require('url-pattern');


class RouteResource extends AbstractResource {

    /**
     * @param {String} path
     * @param {ServiceResource || Array} service
     * @param {String[]} methods
     */
    constructor(path, service , methods = ['GET']) {
        super()
        this.path = path
        this.methods = methods
        this.service = Array.isArray(service) ? new ServiceResource(...service) : service
    }

    resolve(container) {
        const self = this;
        return {
            path: new UrlPattern(this.path),
            service: self.service,
            methods: self.methods,
            context: container,
            async check(req) {
                console.log('parameters', this.path.match(req.path))
                let parameters = this.path.match(req.path)
                console.log({
                    path: self.path,
                    rpath: req.path
                })
                console.log(this.methods, self.path === req.path)
                if ((parameters !== null || self.path === req.path) && this.methods.includes(req.method)) {
                    req.params = parameters || {}
                    return true
                }
                return false
            },
            async handle(req, res) {
                return await this.service.resolve(container).handle(req, res)
            }
        }
    }
}

module.exports  = RouteResource