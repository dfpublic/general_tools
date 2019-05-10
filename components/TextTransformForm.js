import React from 'react';
import { NavPage } from './layouts';
export default class TextTransformForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            original: '',
            transformed: ''
        }
    }
    async componentDidMount() {
        let { default_output, default_input } = this.props;

        //Support for returning promises as props
        if ((typeof default_output) === 'object' && default_output.constructor.name === 'Promise') {
            default_output = await default_output;
        }
        if ((typeof default_input) === 'object' && default_input.constructor.name === 'Promise') {
            default_input = await default_input;
        }
        this.setState({
            original: default_input || '',
            transformed: default_output || ''
        })
    }
    render() {
        let self = this;
        let { original, transformed } = this.state;
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <textarea style={{ height: '80vh', width: '50vw', margin: '3px' }} value={original} onChange={(...p) => { this.onOriginalTextChange(...p) }} />
                    <textarea style={{ height: '80vh', width: '50vw', margin: '3px' }} value={transformed} onClick={this.onOutputTextAreaClick} readOnly={true} />
                </div>
                <button style={{ float: 'right' }} onClick={(...p) => { this.onApplyChangeClicked(...p) }}>Apply Change</button>
            </div>
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
        let { process = () => { console.error('process not defined.') } } = this.props;
        let transformed = await process(original);
        this.setState({ transformed });
    }
}