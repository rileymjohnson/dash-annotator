import React, {Component} from 'react'
import {defaultProps, propTypes} from '../components/DashAnnotator.react'
import PDFAnnotator from './PDFAnnotator.react'
import HTMLAnnotator from './HTMLAnnotator.react'
import TextAnnotator from './TextAnnotator.react'

export default class DashAnnotator extends Component {
    _annotators = {
        'application/pdf': PDFAnnotator,
        'text/html': HTMLAnnotator,
        'text/plain': TextAnnotator,
    }

    render() {
        const {data_type: dataType, ...props} = this.props

        if (!Object.hasOwn(this._annotators, dataType)) {
            throw new Error(
                "Invalid 'data_type'. Valid options are: " +
                "application/pdf', 'text/html', & 'text/plain'."
            )
        }

        const Annotator = this._annotators[dataType]

        return <Annotator {...props} />
    }
}

DashAnnotator.defaultProps = defaultProps
DashAnnotator.propTypes = propTypes
