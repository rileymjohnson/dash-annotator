import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DashAnnotator as RealComponent} from '../LazyLoader'

/**
 * DashAnnotator is used to annotate PDF, HTML,
 * and text files. It accepts a base64 encoding
 * PDF data URL, an HTML string, and a raw text
 * string, respectively.
 */
export default class DashAnnotator extends Component {
    render() {
        return (
            <React.Suspense fallback={null}>
                <RealComponent {...this.props} />
            </React.Suspense>
        )
    }
}

DashAnnotator.defaultProps = {
    highlights: [],
    color: 'lightcoral',
    width: '100%',
    height: '100vh'
}

DashAnnotator.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * List of highlights applied to text.
     */
    highlights: PropTypes.array,

    /**
     * Color of highlights.
     */
    color: PropTypes.string,

    /**
     * Name of event that has occurred.
     */
    event: PropTypes.object,

    /**
     * Base64 encoded PDF, HTML, or Text string.
     */
    data: PropTypes.string,

    /**
     * Type of data passed (pdf, html, text).
     */
    data_type: PropTypes.string,

    /**
     * Height of annotator container.
     */
    height: PropTypes.string,

    /**
     * Width of annotator container.
     */
    width: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
}

export const defaultProps = DashAnnotator.defaultProps
export const propTypes = DashAnnotator.propTypes
