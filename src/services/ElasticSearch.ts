


const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: process.env.ELASTICSEARCH_URI,
    auth: {
        username: process.env.ELASTICSEARCH_USER,
        password: process.env.ELASTICSEARCH_PASSWORD
    }
});


export default client;
