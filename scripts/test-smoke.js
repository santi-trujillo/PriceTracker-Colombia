const http = require('http');

console.log('Running Smoke Test...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('✅ Health Check Passed');
        process.exit(0);
    } else {
        console.error('❌ Health Check Failed');
        process.exit(1);
    }
});

req.on('error', (e) => {
    console.error(`❌ Connection Problem: ${e.message}`);
    process.exit(1);
});

req.end();
