import {PureComponent} from 'react'
import ReactDom from 'react-dom'

import {
    EventBus,
    PDFViewer,
    PDFLinkService,
} from 'pdfjs-dist/web/pdf_viewer'
import {Util} from 'pdfjs-dist/build/pdf'
import Highlight from './Highlight.react'
import {debounce, regexSearch} from '../utils'
import * as R from 'ramda'

import '../styles.scss'

const textBlocksToText = R.pipe(R.pluck('str'), R.join(''))

const getTextBlocksTextlength = R.pipe(
    R.pluck('str'),
    R.transduce(R.map(R.length), R.add, 0)
)

const getCharWidths = (str, font) =>
    R.pipe(
        R.split(''),
        R.map((l) => l.charCodeAt()),
        R.map(R.prop(R.__, font.widths))
    )(str)

const propMin = (prop, items) => R.pipe(R.pluck(prop), R.apply(Math.min))(items)

const getPagesTextBlocksLengthCumulativeSum = R.pipe(
    R.pluck('str'),
    R.map(R.length),
    R.scan(R.add, 0),
    R.slice(1, Infinity)
)

const isClientRectInsidePageRect = (clientRect, pageRect) =>
    clientRect.top >= pageRect.top &&
    clientRect.bottom <= pageRect.bottom &&
    clientRect.right <= pageRect.right &&
    clientRect.left >= pageRect.left

const getClientRects = (range, pages) => {
    const clientRects = Array.from(range.getClientRects())

    const rects = []

    for (const clientRect of clientRects) {
        for (const page of pages) {
            const pageRect = page.node.getBoundingClientRect()

            if (
                isClientRectInsidePageRect(clientRect, pageRect) &&
                clientRect.top >= 0 &&
                clientRect.bottom >= 0 &&
                clientRect.width > 0 &&
                clientRect.height > 0 &&
                clientRect.width < pageRect.width &&
                clientRect.height < pageRect.height
            ) {
                const highlightedRect = {
                    top: clientRect.top + page.node.scrollTop - pageRect.top,
                    left:
                        clientRect.left + page.node.scrollLeft - pageRect.left,
                    width: clientRect.width,
                    height: clientRect.height,
                    page: page.number,
                }
                rects.push(highlightedRect)
            }
        }
    }

    return rects
}

const getDocument = (e) => (e || {}).ownerDocument || document
const getWindow = (e) => (getDocument(e) || {}).defaultView || window
const isHTMLElement = (e) =>
    e instanceof HTMLElement || e instanceof getWindow(e).HTMLElement

const getPageFromElement = (target) => {
    const node = target.closest('.page')

    if (!node || !isHTMLElement(node)) {
        return null
    }

    const number = Number(node.dataset.pageNumber)

    return {node, number}
}

const getPagesFromRange = (range) => {
    const startParentElement = range?.startContainer?.parentElement
    const endParentElement = range?.endContainer?.parentElement

    if (
        !isHTMLElement(startParentElement) ||
        !isHTMLElement(endParentElement)
    ) {
        return []
    }

    const startPage = getPageFromElement(startParentElement)
    const endPage = getPageFromElement(endParentElement)

    if (!startPage?.number || !endPage?.number) {
        return []
    }

    if (startPage.number === endPage.number) {
        return [startPage]
    }

    if (startPage.number === endPage.number - 1) {
        return [startPage, endPage]
    }

    const pages = []

    const document = startPage.node.ownerDocument

    while (startPage.number <= endPage.number) {
        const currentPage = getPageFromElement(
            document.querySelector(`[data-page-number='${startPage.number}'`)
        )
        if (currentPage) {
            pages.push(currentPage)
        }
    }

    return pages
}

const rectToCoords = rect => [
	rect.left, rect.top,
	rect.left + rect.width,
	rect.top + rect.height
]

const rectArea = rect => (
	(rect[2] - rect[0]) *
	(rect[3] - rect[1])
)

export default class PDFHighlighter extends PureComponent {
    eventBus = new EventBus()
    linkService = new PDFLinkService({
        eventBus: this.eventBus,
        externalLinkTarget: 2,
    })

    resizeObserver = null
    containerNode = null
    unsubscribe = () => {}

    constructor(props) {
        super(props)
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(this.debouncedScaleValue)
        }
    }

    componentDidMount() {
        this.init()

        document.querySelector(':root').style.setProperty(
            '--pdf-selection-color',
            this.props.color
        )
    }

    attachRef = (ref) => {
        const {eventBus, resizeObserver: observer} = this
        this.containerNode = ref
        this.unsubscribe()

        if (ref) {
            const {ownerDocument: doc} = ref
            eventBus.on('textlayerrendered', this.onTextLayerRendered)
            eventBus.on('pagesinit', this.onDocumentReady)
            doc.addEventListener('mouseup', this.onMouseUp)
            doc.defaultView?.addEventListener(
                'resize',
                this.debouncedScaleValue
            )
            if (observer) {observer.observe(ref)}

            this.unsubscribe = () => {
                eventBus.off('pagesinit', this.onDocumentReady)
                eventBus.off('textlayerrendered', this.onTextLayerRendered)
                doc.removeEventListener('mouseup', this.onMouseUp)
                doc.defaultView?.removeEventListener(
                    'resize',
                    this.debouncedScaleValue
                )
                if (observer) {observer.disconnect()}
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pdfDocument !== this.props.pdfDocument) {
            this.init()
        } else if (prevProps.highlights !== this.props.highlights) {
            this.renderHighlights(this.props)
        }

        document.querySelector(':root').style.setProperty(
            '--pdf-selection-color',
            this.props.color
        )
    }

    async getPage(pageNumber) {
        const {pdfDocument} = this.props
        return pdfDocument.getPage(pageNumber + 1)
    }

    async getPageTextBlocks(pageNumber) {
        const page = await this.getPage(pageNumber)
        const textContent = await page.getTextContent()
        return textContent.items.map((i) => ({
            page: pageNumber,
            ...i,
        }))
    }

    async calculateXShiftValue(
        {str, width, page, fontName},
        textOffset,
        start = true
    ) {
        const rectPage = await this.getPage(page)
        const font = rectPage.commonObjs.get(fontName)

        const strCharWidths = getCharWidths(str, font)
        const strTotalWidth = R.sum(strCharWidths)

        const firstPipeFunc = start ? R.drop : R.dropLast

        return R.pipe(
            firstPipeFunc(textOffset),
            R.sum,
            R.subtract(strTotalWidth),
            R.divide(R.__, strTotalWidth),
            R.multiply(width),
            R.negate
        )(strCharWidths)
    }

    textBlockRectToHighlightRect(rect, heightScale) {
        const {page, width, height, transform} = rect
        const {viewport} = this.viewer.getPageView(page)
        const {scale, viewBox} = viewport
        const {pdfDocument} = this.props

        return this.relativeRectCoordsToAbsolute(
            {
                left: transform[4] * scale,
                top: (viewBox[3] - transform[5] - height) * scale,
                height: height * scale * heightScale,
                width: width * scale,
                page: Math.min(page + 1, pdfDocument.numPages - 1),
            },
            true
        )
    }

    async search(
        searchString,
        pagesTextBlocks = [],
        page = 0,
        results = [],
        heightScale = 1.1
    ) {
        const totalTextLength = getTextBlocksTextlength(
            pagesTextBlocks.filter((i) => i.page !== page - 2)
        )
        const textWindowIsLargeEnough =
            searchString.length < totalTextLength + 2

        if (textWindowIsLargeEnough) {
            const pagesText = textBlocksToText(pagesTextBlocks)
            const matches = regexSearch(searchString, pagesText)

            for (const match of matches) {
                const text = match[0]
                const startIndex = match.index
                const endIndex = startIndex + text.length

                const pagesTextBlocksLengthCumulativeSum =
                    getPagesTextBlocksLengthCumulativeSum(pagesTextBlocks)

                const startTextBlockIndex = R.findIndex(
                    R.lt(startIndex),
                    pagesTextBlocksLengthCumulativeSum
                )

                const endTextBlockIndex =
                    R.findIndex(
                        R.lte(endIndex),
                        pagesTextBlocksLengthCumulativeSum
                    ) + 1

                const matchTextBlocks = pagesTextBlocks.slice(
                    startTextBlockIndex,
                    endTextBlockIndex
                )

                const startTextOffset =
                    startIndex -
                    pagesTextBlocksLengthCumulativeSum[startTextBlockIndex - 1]

                const endTextOffset =
                    pagesTextBlocksLengthCumulativeSum[endTextBlockIndex - 1] -
                    endIndex

                const startXShiftValue = await this.calculateXShiftValue(
                    matchTextBlocks.at(0),
                    startTextOffset
                )

                const endXShiftValue = await this.calculateXShiftValue(
                    matchTextBlocks.at(-1),
                    endTextOffset,
                    false
                )

                matchTextBlocks.at(0).width += startXShiftValue
                matchTextBlocks.at(0).transform[4] -= startXShiftValue
                matchTextBlocks.at(-1).width += endXShiftValue

                const page = propMin('page', matchTextBlocks) + 1
                const rects = matchTextBlocks.map((rect) =>
                    this.textBlockRectToHighlightRect(rect, heightScale)
                )

                results.push({text, position: {page, rects}})
            }

            if (page === this.props.pdfDocument.numPages) {
                let duplicateHighlights = []

                results.forEach((resultOne, i) => {
                    results.slice(i).forEach(resultTwo => {
                        if (
                            resultOne !== resultTwo &&
                            resultOne.text.toLowerCase() === resultTwo.text.toLowerCase()
                        ) {
                            for (const rectOne of resultOne.position.rects) {
                                for (const rectTwo of resultTwo.position.rects) {
                                    const rectOneCoords = rectToCoords(rectOne)
                                    const rectTwoCoords = rectToCoords(rectTwo)

                                    const rectTwoArea = rectArea(rectTwoCoords)

                                    const intersection = Util.intersect(rectOneCoords, rectTwoCoords)

                                    if (intersection === null) {
                                        continue
                                    }

                                    const intersectionArea = rectArea(intersection)

                                    if (
                                        intersectionArea / rectTwoArea > .9
                                    ) {
                                        duplicateHighlights.push(resultTwo)
                                    }
                                }
                            }
                        }
                    })
                })

                duplicateHighlights = Array.from(
                    new Set(duplicateHighlights)
                )

                return results.filter(
                    h => !duplicateHighlights.includes(h)
                )
            }
            return this.search(
                searchString,
                pagesTextBlocks
                    .filter((i) => i.page !== page - 2)
                    .concat(await this.getPageTextBlocks(page)),
                page + 1,
                results,
                heightScale
            )
        }
        return this.search(
            searchString,
            pagesTextBlocks.concat(await this.getPageTextBlocks(page)),
            page + 1,
            results,
            heightScale
        )
    }

    init() {
        const {pdfDocument} = this.props

        this.viewer =
            this.viewer ||
            new PDFViewer({
                container: this.containerNode,
                eventBus: this.eventBus,
                textLayerMode: 2,
                removePageBorders: true,
                linkService: this.linkService,
                renderer: 'canvas',
                l10n: null,
            })

        this.linkService.setDocument(pdfDocument)
        this.linkService.setViewer(this.viewer)
        this.viewer.setDocument(pdfDocument)

        this.searchForHighlights()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    async searchForHighlights() {
        const highlightsToSearch = this.props.highlights.filter(
            h => !Object.hasOwn(h, 'position')
        )

        if (highlightsToSearch.length > 0) {
            const results = await Promise.allSettled(
                highlightsToSearch.map(
                    ({ text }) => this.search(text)
                )
            )

            this.props.onNewSearchResults(
                results.map(
                    (r, i) => r.value.map(v => ({
                        color: highlightsToSearch[i].color,
                        ...v
                    }))
                ).flat()
            )
        }
    }

    relativeRectCoordsToAbsolute(rect, reverse = false) {
        const func = reverse ? R.divide : R.multiply
        const {width, height} = this.viewer.getPageView(rect.page - 1)
        return {
            left: func(rect.left, width),
            top: func(rect.top, height),
            width: func(rect.width, width),
            height: func(rect.height, height),
            page: rect.page,
        }
    }

    renderHighlights(nextProps) {
        const {highlights} = nextProps || this.props
        const {pdfDocument} = this.props

        const highlightsByPage = R.groupBy(
            R.path(['position', 'page']),
            R.filter(Boolean, highlights)
        )

        for (let page = 1; page <= pdfDocument.numPages; page++) {
            const {textLayer, width, height} =
                this.viewer.getPageView(page - 1) || {}

            if (!textLayer || width === null || height === null) {
                continue
            }

            let highlightLayer = textLayer.textLayerDiv.querySelector(
                '.highlight-layer'
            )

            if (!highlightLayer) {
                highlightLayer = getDocument(
                    textLayer.textLayerDiv
                ).createElement('div')
                highlightLayer.className = 'highlight-layer'
                textLayer.textLayerDiv.appendChild(highlightLayer)
            }

            if (highlightLayer) {
                ReactDom.render(
                    <div>
                        {(highlightsByPage[String(page)] || []).map(
                            (highlight, index) => {
                                return (
                                    <Highlight
                                        id={highlight.id}
                                        color={
                                            highlight.color || this.props.color
                                        }
                                        position={{
                                            ...highlight.position,
                                            rects: highlight.position.rects.map(
                                                (rect) =>
                                                    this.relativeRectCoordsToAbsolute(
                                                        rect
                                                    )
                                            ),
                                        }}
                                        key={index}
                                        onClick={() => {
                                            this.props.onAnnotationClick(
                                                highlight
                                            )
                                        }}
                                        onMouseOver={() => {
                                            this.props.onAnnotationHover(
                                                highlight
                                            )
                                        }}
                                        onMouseOut={() => {
                                            this.props.onAnnotationOut()
                                        }}
                                    />
                                )
                            }
                        )}
                    </div>,
                    highlightLayer
                )
            }
        }
    }

    onTextLayerRendered = () => {
        this.renderHighlights()
    }

    onDocumentReady = () => {
        this.handleScaleValue()
    }

    onMouseUp = () => {
        const container = this.containerNode
        const selection = getWindow(container).getSelection()

        if (!selection) {return}

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

        if (selection.isCollapsed) {return}

        if (
            !range ||
            !container ||
            !container.contains(range.commonAncestorContainer)
        ) {return}

        setTimeout(() => {
            selection.removeAllRanges()

            const pages = getPagesFromRange(range)
            const rects = getClientRects(range, pages)
            console.log('rects', rects)

            if (!range || !pages || pages.length === 0 || rects.length === 0)
                {return}

            this.props.onSelectionFinished(
                {
                    page: pages[0].number,
                    rects: rects.map((rect) =>
                        this.relativeRectCoordsToAbsolute(rect, true)
                    ),
                },
                range.toString()
            )
        }, 300)
    }

    onMouseDown = (event) => {
        if (!isHTMLElement(event.target)) {
            return
        }
    }

    handleScaleValue = () => {
        if (this.viewer) {
            this.viewer.currentScaleValue = 'auto'
        }
    }

    debouncedScaleValue = debounce(this.handleScaleValue, 500)

    render() {
        return (
            <div
              // eslint-disable-next-line react/no-unknown-property
              onPointerDown={this.onMouseDown}
              className="pdf-annotator"
            >
                <div
                    ref={this.attachRef}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                        height: this.props.height,
                        width: this.props.width,
                    }}
                >
                    <div />
                </div>
            </div>
        )
    }
}
