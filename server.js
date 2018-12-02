'use strict';

const Hapi = require('hapi');
const CalculateBestMatch = require('./lib/services/calculatebestmatch');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return h.file('./lib/templates/index.html');
    }
});

server.route({
    method: 'GET',
    path: '/scripts/js/index.js',
    handler: (request, h) => {

        return h.file('./lib/scripts/js/index.js');
    }
});

server.route({
    method: 'POST',
    path: '/calculate/bestmatch',
    handler: (request, h) => {

        var res = CalculateBestMatch(request.payload);
        const response =  h.response(res);
        response.type('application/json');
        return response;
            
    }
});


const init = async () => {

    await server.register(require('inert'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();