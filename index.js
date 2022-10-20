const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const Call = require('./calls');
const InfusionSoftCall = require('./infusionSoftCalls');

const addToWorkflow = async (params, res) => {
    const email = params.email;
    const workflowID = params.workflow;
    if (!params.email || !params.workflow){
        return res.status(400).json({message: 'Some parameters are missing!!'})
    }
    let message = '';
    const apiCall = new Call(params.key, params.email, params.workflow);
    let contact = await apiCall.lookUpContact();
    if (!contact){
        contact = await apiCall.createContact();
        console.log(`Created contact ${contact}`);
    }
    else contact = contact[0];
    if (await apiCall.addContactToWorkflow(contact.id)){
        message = 'Contact added to workflow';
    }
    else{
        message = 'Error in adding contact to workflow.';
    }
    console.log(message);
    return res.json({message: message});
};

const addIDToTag = async (params, res) => {
    let message = '';
    if (!params.givenName || !params.familyName || !params.email || !params.phone || !params.tagID || !params.homeOwnership){
        return res.status(400).json({message: 'Some parameters are missing!!'})
    }
    const apiCall = new InfusionSoftCall(
        params.givenName, 
        params.familyName, 
        params.email,
        params.phone,
        params.homeOwnership,
        params.tagID
    );
    let contact = await apiCall.getContact();
    if (!contact){
        return res.status(400).json({message: 'Invalid parameters'});
    }
    if (await apiCall.addTagToContact(contact.id)){
        message = 'Tag added to contact';
    }
    else{
        message = 'Error in adding tag to contact.';
    }
    console.log(message);
    return res.json({message: message});
};

app.post('/infosoft/lead/post', (req, res, next) => {
    console.log('InfoSoft Lead POST URL');
    console.log(req);
    console.log(req.body);
    console.log(req.query);
    return addIDToTag(req.body, res);
});

app.post('/infosoft/post', (req, res, next) => {
    console.log('InfoSoft POST URL');
    console.log(req.query);
    return addIDToTag(req.query, res);
});

app.get('/infosoft/get', (req, res, next) => {
    console.log('InfoSoft GET URL');
    console.log(req.query);
    return addIDToTag(req.query, res);
});

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

app.post('/lead/post', (req, res, next) => {
    console.log('Lead POST URL');
    console.log(req.body.customData);
    return addToWorkflow(req.body.customData, res);
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
