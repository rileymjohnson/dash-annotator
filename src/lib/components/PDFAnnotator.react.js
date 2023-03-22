import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {PDFAnnotator as RealComponent} from '../LazyLoader'

/**
 * PDFAnnotator is used to annotate PDF files. It
 * renders a base64 encoded  PDF data url, which
 * the user can highlight.
 */
export default class PDFAnnotator extends Component {
    render() {
        return (
            <React.Suspense fallback={null}>
                <RealComponent {...this.props} />
            </React.Suspense>
        )
    }
}

PDFAnnotator.defaultProps = {
    highlights: [],
    color: 'lightcoral',
    width: '100%',
    height: '100vh'
}

PDFAnnotator.propTypes = {
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
     * Base64 encoded PDF string.
     */
    data: PropTypes.string,

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

export const defaultProps = PDFAnnotator.defaultProps
export const propTypes = PDFAnnotator.propTypes
