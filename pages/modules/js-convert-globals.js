import { SimplePage, NavPage, createNavPageNavigationProps } from "../../components/layouts";
import React from 'react';
import Axios from 'axios';
import { CONFIG } from "../../config";
import TextTransformForm from "../../components/TextTransformForm";
// import * as JsConvertExports from '../modules/js-convert-exports/generator';
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transformed: ''
        }
    }
    render() {
        return (
            <NavPage
                title={TITLE}
                description={DESCRIPTION}>
                <TextTransformForm
                    default_input={SAMPLE_INPUT}
                    default_output={SAMPLE_OUTPUT}
                    process={(original) => (process(original))}>
                </TextTransformForm>
            </NavPage>
        )
    }
    /**
     * @param {MouseEvent} event 
     */
    onInputTextAreaClick(event) {
        /** @type {HTMLTextAreaElement | any} */
        let textarea = event.target;
        textarea.focus();
        textarea.select();
    }

    /**
     * @param {MouseEvent} event 
     */
    onOutputTextAreaClick(event) {
        /** @type {HTMLTextAreaElement | any} */
        let textarea = event.target;
        textarea.focus();
        textarea.select();
    }

    onOriginalTextChange(event) {
        this.setState({
            original: event.target.value
        })
    }

    async onApplyChangeClicked(event) {
        let { original } = this.state;
        let transformed = await process(original);
        this.setState({ transformed });
    }
}

async function process(input) {
    let res = await Axios.post(`${CONFIG.API_URL}/modules/process/js-convert-globals`, { data: input });
    let { errors, new_data } = res.data;
    if (errors) {
        console.error(errors);
        return 'failed.';
    }
    return new_data;
}
const TITLE = 'JS Convert Globals';
const DESCRIPTION = `'Convert Global Functions to non-global ones'`;
const SAMPLE_INPUT = 
`x = function () {

}`
const SAMPLE_OUTPUT = 
`let x = function () {

}

module.exports = {
    x
}`;