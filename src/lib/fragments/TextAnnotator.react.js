import React, {Component} from 'react'
import {defaultProps, propTypes} from '../components/TextAnnotator.react'
import HTMLAnnotator from './HTMLAnnotator.react'

export default class TextAnnotator extends Component {
    render() {
        const props = {
            ...this.props,
            data: `<pre>${this.props.data}</pre>`,
        }

        return <HTMLAnnotator {...props} />
    }
}

TextAnnotator.defaultProps = defaultProps
TextAnnotator.propTypes = propTypes
