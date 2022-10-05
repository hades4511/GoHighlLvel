require('dotenv').config();
const axios = require('axios');

module.exports = class InfusionSoftCall{
    constructor(givenName, familyName, email, phone, homeOwnership, tagID){
        this.HEADERS = {
            'X-Keap-API-Key': process.env.infusionSoftAPIKey
        }
        this.givenName = givenName;
        this.familyName = familyName;
        this.email = email;
        this.phone = phone;
        this.homeOwnership = homeOwnership;
        this.tagID = tagID;
    }

    async lookUpContact(){
        const emailQuery = encodeURIComponent(`email==${this.email}`)
        console.log(emailQuery);
        const url = `${process.env.infusionSoftURL}/contacts?filter=${emailQuery}&fields=email_addresses,phone_numbers,custom_fields`
        console.log(url);
        try{
            const response = await axios({
                method: 'GET',
                headers: this.HEADERS,
                url: url
            });
            return response.data.contacts;
        }
        catch (error){
            console.log(`Error getting contact: ${error.response.status}`);
            console.log(error.response.data);
            return null;
        }
    };
    
    async createOrUpdateContact(contactID){
        let url = `${process.env.infusionSoftURL}/contacts?fields=custom_fields,email_addresses,phone_numbers`;
        let mode = 'POST'
        if (contactID){
            url = `${process.env.infusionSoftURL}/contacts/${contactID}?fields=custom_fields,email_addresses,phone_numbers`;
            mode = 'PATCH'
        }
        console.log(url)
        try{
            const response = await axios({
                method: mode,
                headers: this.HEADERS,
                url: url,
                data: {
                    given_name: this.givenName,
                    family_name: this.familyName,
                    email_addresses:[
                        {
                           email: this.email,
                           field: "EMAIL1",
                           opt_in_reason: "Reason"
                        }
                     ],
                     phone_numbers:[
                        {
                           number: this.phone,
                           extension: null,
                           field: "PHONE1",
                           type: null
                        }
                    ],
                    custom_fields:[
                        {
                            id: "2005",
                           content: this.homeOwnership,
                        }
                    ],
                },
            });
            return response.data;
        }
        catch (error){
            console.log(`Error ${contactID ? 'updating' : 'creating'} contact: ${error.response ? error.response.status : ''}`);
            console.log(error.response ? error.response.data : error);
            return null;
        }
    };

    async getContact(){
        let contact = await this.lookUpContact();
        const contactID = contact.length ? contact[0].id : null;
        console.log(contact.length ? 'Contact found, updating it' : 'Contact not found, creating one');
        contact = await this.createOrUpdateContact(contactID);
        return contact
    }
    
    async addTagToContact(contactID){
        const url = `${process.env.infusionSoftURL}/tags/${this.tagID}/contacts:applyTags`;
        try{
            const response = await axios({
                method: 'post',
                headers: this.HEADERS,
                url: url,
                data: {contact_ids: [contactID, ]}
            });
            return true
        }
        catch (error){
            console.log(`Error adding to workflow: ${error.response.status}`);
            console.log(error.response.data);
            return false;
        }
    };
}
