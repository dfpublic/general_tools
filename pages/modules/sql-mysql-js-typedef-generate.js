import React from 'react';
import Axios from 'axios';
import { CONFIG } from '../../config';
import { generatePageComponent } from '../../components/PageComponent';
// import * as JsConvertExports from '../modules/js-convert-exports/generator';

async function process(input) {
    let res = await Axios.post(`${CONFIG.API_URL}/modules/process/mysql-typedef-generate`, { data: input });
    let { errors, new_data } = res.data;
    if (errors) {
        console.error(errors);
        return 'failed.';
    }
    return new_data;
}
const TITLE = 'JS Convert Globals';
const DESCRIPTION = '\'Convert Global Functions to non-global ones\'';
const SAMPLE_INPUT = 
`user_particular`;
const SAMPLE_OUTPUT = 
`/**
* @typedef UserParticular
* @property {string} [user_fk]
* @property {string} [first_name]
* @property {string} [middle_name]
* @property {string} [last_name]
* @property {string} [user_short_name]
* @property {string} [office_number]
* @property {string} [mobile_number]
* @property {string} [mobile_number_verified_date]
* @property {string} [mobile_number_verify_code]
* @property {string} [email]
* @property {string} [nationality]
* @property {string} [identification_number]
* @property {string} [address_1]
* @property {string} [address_2]
* @property {string} [postal_code]
* @property {string} [country_code]
* @property {string} [profile_picture]
* @property {string} [interests]
* @property {string} [linkedin]
* @property {string} [what_i_do]
* @property {string} [created_by]
* @property {string} [created_date]
* @property {string} [updated_by]
* @property {string} [updated_date]
*/`;

let Component = generatePageComponent({
    title: TITLE,
    description: DESCRIPTION,
    sample_input: SAMPLE_INPUT,
    sample_output: SAMPLE_OUTPUT,
    process: process
});
export default Component;