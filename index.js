const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const calls = require('./calls');

const startCampaign = async (params, res) => {
    const email = params.email;
    const campaignId = params.campaign_id;
    let message = ''
    let contact = await calls.lookUpContact(email);
    if (!contact){
        contact = await calls.createContact(email);
        console.log(`Created contact ${contact}`);
    }
    if (await calls.addContactToCampaign(contact.id, campaignId)){
        message = 'Contact added to campaign';
    }
    else{
        message = 'Error in adding contact to campaign.';
    }
    console.log(message);
    return res.json({message: message});
};

app.post('/post', (req, res, next) => {
    console.log('POST URL');
    console.log(req.query);
    return startCampaign(req.query);
});

app.get('/get', (req, res, next) => {
    console.log('GET URL');
    console.log(req.query);
    return startCampaign(req.query);
});

app.post('/lead/post', (req, res, next) => {
    console.log('Lead POST URL');
    console.log(req.body.customData);
    return startCampaign(req.body.customData);
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
