import { NavPage } from "../components/layouts";
import React from 'react';
import Axios from 'axios';
import { CONFIG } from "../config";
// import * as JsConvertExports from '../modules/js-convert-exports/generator';
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            original: 'asdf',
            transformed: ''
        }
    }
    render() {
        let { original, transformed } = this.state;
        return (
            <NavPage title='General Tools' description=''>
                <a href="/modules/js-convert-exports">JS Convert Exports</a>
            </NavPage>
        )
    }

    onOriginalTextChange(event) {
        this.setState({
            original: event.target.value
        })
    }

    async onApplyChangeClicked(event) {
        let { original } = this.state;
        let transformed = await JsConvertExports(original);
        this.setState({ transformed });
    }
}

async function JsConvertExports(input) {
    let res = await Axios.post(`${CONFIG.API_URL}/modules/process/js-convert-exports`, {data: input})
    let {errors, new_data } = res.data;
    if(errors) {
        console.error(errors);
        return 'failed.';
    }
    return new_data;
    // return res.data ? res.data.new_data : 'failed';
}