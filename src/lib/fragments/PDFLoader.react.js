import React, {Component} from 'react'

import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist/build/pdf'

var BASE64_MARKER = ';base64,'

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
    var base64 = dataURI.substring(base64Index)
    var raw = window.atob(base64)
    var rawLength = raw.length
    var array = new Uint8Array(new ArrayBuffer(rawLength))

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i)
    }
    return array
}

export default class PDFLoader extends Component {
    state = {
        pdfDocument: null,
        error: null,
    }

    static defaultProps = {
        workerSrc:
            'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js',
    }

    documentRef = React.createRef()

    componentDidMount() {
        this.load()
    }

    componentWillUnmount() {
        const {pdfDocument: discardedDocument} = this.state
        if (discardedDocument) {
            discardedDocument.destroy()
        }
    }

    componentDidUpdate({data}) {
        if (this.props.data !== data) {
            this.load()
        }
    }

    componentDidCatch(error) {
        const {onError} = this.props

        if (onError) {
            onError(error)
        }

        this.setState({pdfDocument: null, error})
    }

    load() {
        const {ownerDocument = document} = this.documentRef.current || {}
        const {data, cMapUrl, cMapPacked, workerSrc} = this.props
        const {pdfDocument: discardedDocument} = this.state
        this.setState({pdfDocument: null, error: null})

        if (typeof workerSrc === 'string') {
            GlobalWorkerOptions.workerSrc = workerSrc
        }

        Promise.resolve()
            .then(() => discardedDocument && discardedDocument.destroy())
            .then(() => {
                if (!data) {return}

                getDocument({
                    ...this.props,
                    data: convertDataURIToBinary(data),
                    fontExtraProperties: true,
                    ownerDocument,
                    workerSrc,
                    cMapUrl,
                    cMapPacked,
                }).promise.then((pdfDocument) => {
                    this.setState({pdfDocument})
                })
            })
            .catch((e) => this.componentDidCatch(e))
    }

    render() {
        const {children, beforeLoad} = this.props
        const {pdfDocument, error} = this.state
        return (
            <>
                <span ref={this.documentRef} />
                {error
                    ? this.renderError()
                    : !pdfDocument || !children
                    ? beforeLoad
                    : children(pdfDocument)}
            </>
        )
    }

    renderError() {
        const {errorMessage} = this.props
        if (errorMessage) {
            return React.cloneElement(errorMessage, {error: this.state.error})
        }

        return null
    }
}
