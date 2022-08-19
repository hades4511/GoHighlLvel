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

exports.addContactToWorkflow = async (contactID, workflowID) => {
    const url = `${process.env.url}/contacts/${contactID}/workflow/${workflowID}`;
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
    console.log(currentTime);
    console.log(updated);
    try{
        const response = await axios({
            method: 'post',
            headers: HEADERS,
            url: url,
            data: {eventStartTime: updated}
        });
        return true
    }
    catch (error){
        console.log(`Error adding to workflow: ${error.response.status}`);
        console.log(error.response.data);
        return false;
    }
};
