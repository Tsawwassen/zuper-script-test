const { app } = require('@azure/functions');

app.timer('timer-updateOverdueTrials', {
    schedule: '0 0 10 * * *',
    handler: async (myTimer, context) => {
        context.log('Timer updateOverdueTrials processed request.');

        let allData = [];
        let page = 1;
        let hasMoreData = true;
        let pageCount = 50;

        while (hasMoreData) {

            const url = `https://us-west-1c.zuperpro.com/api/jobs?filter.category=8e9b1799-8c85-4c68-99da-2af2dd981780&filter.job_status=0d35c45c-4454-4f0e-9b29-ba2c4311a8b5&page=${page}&count=${pageCount}`
            const options = {
                method: 'GET',
                headers: {accept: 'application/json', 'x-api-key': process.env.ZUPER_API_KEY}
            };

            try { 
                const response = await fetch(url, options);
                const result = await response.json();

                //console.log(result);

                allData.push(...result.data);

                if (result.data.length < pageCount) {
                    hasMoreData = false;
                } else {
                    page++;
                }
            } catch(error){
                context.log('API call failed:', error);
                console.log("error")
                return { status: 500, body: 'Error calling Zuper API' };
            }
        }

        let overdue_flag = false;

        allData.forEach((job) => {
            overdue_flag = false;

            job.custom_fields.forEach((field)=>{
                if(field.label === 'Trial Overdue Date'){
                    let job_date = new Date(field.value);
                    let current_date = new Date();

                    current_date.setHours(0, 0, 0, 0);
                    job_date.setHours(0, 0, 0, 0);      

                    if (job_date < current_date) {
                        console.log("The job date is in the past.");
                        overdue_flag = true;
                    }
                }
            })

            if(overdue_flag){
                console.log(`Overdue job: ${job.job_uid}`);

                const url = `https://us-west-1c.zuperpro.com/api/jobs/${job.job_uid}/status`;
                const options = {
                    method: 'PUT',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'x-api-key': process.env.ZUPER_API_KEY
                    },

                    body: JSON.stringify({
                        job_uid: `${job.job_uid}`,
                        status_uid: 'a67451e1-ddf1-43f6-aca6-74000971ee0a'
                    })
                };

                // fetch(url, options)
                // .then(res => res.json())
                // .then(json => console.log(json))
                // .catch(err => console.error(err));
                try{ 
                    const update_response = fetch(url, options);
                } catch(error){
                    context.log('API call failed:', error);
                    console.log("error")
                    return { status: 500, body: 'Error calling Zuper API' };
                }
            }
        });
        return {
            status: 200,
            body: JSON.stringify("overdue update script complete") // or `Zuper!` if you just want to confirm
        };
    }
});
