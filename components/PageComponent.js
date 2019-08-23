import { SimplePage, NavPage, createNavPageNavigationProps } from './layouts';
import React from 'react';
import TextTransformForm from './TextTransformForm';
// import * as JsConvertExports from '../modules/js-convert-exports/generator';

/**
 * @typedef ComponentProps
 * @property {string} title
 * @property {string} description
 * @property {string} sample_input
 * @property {string} sample_output
 * @property {function} process
 */
/**
 * 
 * @param {ComponentProps} config 
 */
export function generatePageComponent(config) {
    return class extends React.Component {
        render() {
            return <PageComponent {...config}/>;
        }
    }
}

class PageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transformed: ''
        };
    }
    render() {
        let { title, description, sample_input, sample_output, process } = this.props;
        return (
            <NavPage
                title={title}
                description={description}>
                <TextTransformForm
                    default_input={sample_input}
                    default_output={sample_output}
                    process={(original) => (process(original))}>
                </TextTransformForm>
            </NavPage>
        );
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
        });
    }

    async onApplyChangeClicked(event) {
        let { process } = this.props;
        let { original } = this.state;
        let transformed = await process(original);
        this.setState({ transformed });
    }
}