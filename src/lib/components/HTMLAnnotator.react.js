import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {HTMLAnnotator as RealComponent} from '../LazyLoader'

/**
 * HTMLAnnotator is used to annotate HTML. It renders
 * an HTML string, which the user can highlight.
 */
export default class HTMLAnnotator extends Component {
    render() {
        return (
            <React.Suspense fallback={null}>
                <RealComponent {...this.props} />
            </React.Suspense>
        )
    }
}

HTMLAnnotator.defaultProps = {
    highlights: [],
    color: 'lightcoral',
    width: '100%',
    height: '100vh'
}

HTMLAnnotator.propTypes = {
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
     * HTML string.
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

export const defaultProps = HTMLAnnotator.defaultProps
export const propTypes = HTMLAnnotator.propTypes
