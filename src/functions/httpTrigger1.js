const { app } = require('@azure/functions');

// example url http://localhost:7071/api/httpTrigger1?name=Mitchell
app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url ${request.url}`);

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});
