const { app } = require('@azure/functions');


// example url http://localhost:7071/api/httpTrigger1?name=Mitchell
app.http('zuperAPI', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        console.log("hello");

        const options = {
            method: 'GET',
            headers: {accept: 'application/json', 'x-api-key': process.env.ZUPER_API_KEY}
            };

      try {
            const response = await fetch('https://us-west-1c.zuperpro.com/api/jobs', options);
            const data = await response.json();

            // Log some of the API response
            //context.log('Zuper API call succeeded:', JSON.stringify(data).substring(0, 200));
            console.log("success")
            return {
                status: 200,
                body: JSON.stringify(data) // or `Zuper!` if you just want to confirm
            };
        } catch (error) {
            context.log('API call failed:', error);
            console.log("error")
            return { status: 500, body: 'Error calling Zuper API' };
        }
    }
});
