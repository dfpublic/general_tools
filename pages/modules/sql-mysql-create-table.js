import { SimplePage, NavPage, createNavPageNavigationProps } from "../../components/layouts";
import React from 'react';
import Axios from 'axios';
import { CONFIG } from "../../config";
import TextTransformForm from "../../components/TextTransformForm";
import process from '../../modules/sql-mysql-create-table/generator';
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

const TITLE = 'MYSQL Create Table';
const DESCRIPTION = `Generate create table statement for MySQL`;
const SAMPLE_INPUT = 
`table_name: test_users
user_id: primary, NVARCHAR(50)
first_name: index, NVARCHAR(50)
last_name: NVARCHAR(50)
username: unique, NVARCHAR(50), NULL
`.trim();
// const SAMPLE_OUTPUT = 
// `let testController = module.exports;

// module.exports.hi = function () {
//     console.log('hi')
// }`;
const SAMPLE_OUTPUT = process(SAMPLE_INPUT);