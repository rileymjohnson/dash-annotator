import {Component, createRef} from 'react'
import {defaultProps, propTypes} from '../components/PDFAnnotator.react'

import PDFHighlighter from './PDFHighlighter.react'
import PDFLoader from './PDFLoader.react'
import {generateId} from '../utils'

import {Util} from 'pdfjs-dist/build/pdf'
import * as R from 'ramda'
window.Util = Util
window.R = R

export default class PDFAnnotator extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lastHoveredHighlight: null
        }

        console.log(this)
        this.highlighter = createRef()
    }

    onAnnotationCreated(highlight) {
        this.props.setProps({
            highlights: [highlight, ...this.props.highlights],
        })
        this.triggerEvent('new_highlight', highlight.id)
    }

    onAnnotationClick({id}) {
        this.triggerEvent('clicked_highlight', id)
    }

    onAnnotationHover({id}) {
        if (id !== this.state.lastHoveredHighlight) {
            this.setState({ lastHoveredHighlight: id })
            this.triggerEvent('hovered_highlight', id)
        }
    }

    onAnnotationOut() {
        if (this.state.lastHoveredHighlight !== null) {
            this.setState({ lastHoveredHighlight: null })
        }
    }

    async onNewSearchResults(searchResults) {
        let highlights = this.props.highlights.filter(
            h => Object.hasOwn(h, 'position')
        )

        highlights = [
            ...searchResults.map(s => ({ ...s, id: generateId() })),
            ...highlights
        ]

        this.triggerEvent('new_search_results', null, { highlights })
    }

    triggerEvent(name, value, extraProps = {}) {
        this.props.setProps({
            event: {name, value, _: !this.props.event?._},
            ...extraProps,
        })
    }

    render() {
        console.log(this)
        const {data, color, width, height, highlights} = this.props

        return (
            <PDFLoader data={data}>
                {(pdfDocument) => (
                    <PDFHighlighter
                        ref={this.highlighter}
                        color={color}
                        height={height}
                        width={width}
                        pdfDocument={pdfDocument}
                        onAnnotationClick={this.onAnnotationClick.bind(this)}
                        onAnnotationHover={this.onAnnotationHover.bind(this)}
                        onAnnotationOut={this.onAnnotationOut.bind(this)}
                        onNewSearchResults={this.onNewSearchResults.bind(this)}
                        onSelectionFinished={(position, text) =>
                            this.onAnnotationCreated({
                                id: generateId(),
                                text,
                                position,
                                color
                            })
                        }
                        highlights={highlights}
                    />
                )}
            </PDFLoader>
        )
    }
}

PDFAnnotator.defaultProps = defaultProps
PDFAnnotator.propTypes = propTypes
