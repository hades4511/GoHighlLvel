require('dotenv').config();
const axios = require('axios');

const HEADERS = {
    'Authorization': `Bearer ${process.env.apiKey}`
}

exports.lookUpContact =  async email => {
    const url = `${process.env.url}/contacts/lookup?email=${email}`
    try{
        const response = await axios({
            method: 'get',
            headers: HEADERS,
            url: url,
        });
        return response.data.contacts;
    }
    catch (error){
        console.log(`Error getting contact: ${error.response.status}`);
        console.log(error.response.data);
        return null;
    }
};

exports.createContact = async email => {
    const url = `${process.env.url}/contacts/`
    try{
        const response = await axios({
            method: 'post',
            headers: HEADERS,
            url: url,
            data: {email: email},
        });
        return response.data.contact;
    }
    catch (error){
        console.log(`Error creating contact: ${error.response.status}`);
        console.log(error.response.data);
        return null;
    }
};

exports.addContactToCampaign = async (contactID, campaignID) => {
    const url = `${process.env.url}/contacts/${contactID}/campaigns/${campaignID}`;
    try{
        const response = await axios({
            method: 'post',
            headers: HEADERS,
            url: url,
        });
        return true
    }
    catch (error){
        console.log(`Error adding to campaign: ${error.response.status}`);
        console.log(error.response.data);
        return false;
    }
};
