const Hapi = require('hapi');
const Hoek = require('hoek');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        return reply.view('index.html', {
            msg: 'this is title',
            title: 'I am title!',
            body: '<p style="color: red">this is body content</p>'
        });
    }
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
        let res = 'Hello W1rld!' + new Date();
        return reply(res)
              .type('text/plain')
              .header('X-Custom', 'some-value');
    }
});

server.route({
    method: 'GET',
    path:'/test.min.js',
    handler: function (request, reply) {
        return reply.file('test.js');
    }
});

server.register(require('vision'), (err) => {
    Hoek.assert(!err, err);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'tpl'
    });
});

// Start the server
server.register({
        register: require('inert'),
        options: {}
    },
    (err) => {
        if (err) throw err;

        server.start((err) => {
            if (err) {
                throw err;
            }

            console.log(`Server running at: ${server.info.uri}`);
        });
    }
);
