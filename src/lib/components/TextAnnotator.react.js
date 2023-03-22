import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextAnnotator as RealComponent} from '../LazyLoader'

/**
 * TextAnnotator is used to annotate text. It renders
 * a text string, which the user can highlight.
 * Note: this class is the same as the `HTMLAnnotator`
 * class, except it accepts text instead of HTML and
 * passes that text to the `HTMLAnnotator` wrapped
 * in a `<pre />` tag.
 */
export default class TextAnnotator extends Component {
    render() {
        return (
            <React.Suspense fallback={null}>
                <RealComponent {...this.props} />
            </React.Suspense>
        )
    }
}

TextAnnotator.defaultProps = {
    highlights: [],
    color: 'lightcoral',
    width: '100%',
    height: '100vh'
}

TextAnnotator.propTypes = {
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
     * Text string.
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

export const defaultProps = TextAnnotator.defaultProps
export const propTypes = TextAnnotator.propTypes
