import cookieFactory from './cookie';
import Hoek from 'hoek';

export default class Application {

  constructor(routes, options) {
    this.options = options;
    this.registerRoutes(routes);
  }

  registerRoutes(routes) {
    for (let path in routes) {
      this.addRoute(path, routes[path]);
    }
  }

  addRoute(path, Controller) {
    this.options.server.route({
      path: path,
      method: 'GET',
      handler: (request, reply) => {
        const controller = new Controller({
          query: request.query,
          params: request.params,
          cookie: cookieFactory(request, reply)
        });

        controller.index(this, request, reply, (err) => {
          if (err) {
            return reply(err);
          }

          controller.toString((err, html) => {
            if (err) {
              return reply(err);
            }

            this.options.document(this, controller, request, reply, html, (err, html) => {
              if (err) {
                return reply(err);
              }

              return reply(html);
            });
          });
        });
      }
    });
  }

  start() {
    let server = this.options.server

    server.register([require('vision'), require('inert')], (err) => {
        Hoek.assert(!err, err);
        server.views({
            engines: {
                html: require('handlebars')
            }
        });

        if (err) throw err;

        server.start((err) => {
            if (err) {
                throw err;
            }

            console.log(`Server running at: ${server.info.uri}`);
        });
    });
  }
}
