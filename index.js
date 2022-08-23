const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const Call = require('./calls');

const addToWorkflow = async (params, res) => {
    const email = params.email;
    const workflowID = params.workflow;
    let message = '';
    const apiCall = new Call(params.key, params.email, params.workflow);
    let contact = await apiCall.lookUpContact();
    if (!contact){
        contact = await apiCall.createContact();
        console.log(`Created contact ${contact}`);
    }
    else contact = contact[0];
    console.log(contact);
    if (await apiCall.addContactToWorkflow(contact.id)){
        message = 'Contact added to workflow';
    }
    else{
        message = 'Error in adding contact to workflow.';
    }
    console.log(message);
    return res.json({message: message});
};

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    console.log(req.query);
    return addToWorkflow(req.query, res);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    console.log(req.query);
    return addToWorkflow(req.query, res);
});

app.get('/get/time', (req, res, next) => {
    const toIsoString = date => {
        const tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                return (num < 10 ? '0' : '') + num;
            };
      
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }
    const currentTime = new Date();
    const updated = toIsoString(new Date(currentTime.getTime() + 1000 * 60));
    return res.json({
        'time': currentTime,
        'updatedTime': updated
    });
});

app.post('/lead/post', (req, res, next) => {
    console.log('Lead POST URL');
    console.log(req.body.customData);
    return addToWorkflow(req.body.customData, res);
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
