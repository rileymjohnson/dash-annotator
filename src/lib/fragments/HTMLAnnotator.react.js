import {Component, createRef} from 'react'
import * as R from 'ramda'
import {defaultProps, propTypes} from '../components/HTMLAnnotator.react'
import {generateId} from '../utils'

export default class HTMLAnnotator extends Component {
    constructor(props) {
        super(props)

        this.htmlIframe = createRef()
        console.log(this)
    }

    componentDidMount() {
        this.removeIframeEventHandlers()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.props.setProps({ highlights: [] })
        }

        this.removeIframeEventHandlers()
    }

    componentWillUnmount() {
        this.removeIframeEventHandlers()
    }

    removeIframeEventHandlers() {
        if (this.getDocument()) {
            this.getDocument().removeEventListener(
                'mouseup',
                this.onMouseUp.bind(this)
            )
        }
    }

    setIframeEventHandlers() {
        if (this.getDocument()) {
            this.getDocument().addEventListener(
                'mouseup',
                this.onMouseUp.bind(this)
            )
        }
    }

    iframeOnLoad() {
        this.setIframeEventHandlers()

        this.props.highlights
            .sort((a, b) => R.has('position', b) - R.has('position', a))
            .forEach((highlight) => {
                highlight.position.forEach((mark) => {
                    var {parentXpath, offset, textLength} = mark
                    var parent = this.getNodeFromXpath(parentXpath)
                    parent.normalize()

                    var totalOffset = offset
                    let markTextNode

                    for (const childNode of parent.childNodes) {
                        totalOffset -= childNode.textContent.length
                        markTextNode = childNode
                        if (totalOffset < 0) {break}
                    }

                    if (markTextNode !== undefined) {
                        if (offset > 0) {
                            markTextNode = markTextNode.splitText(
                                totalOffset + markTextNode.length
                            )
                        }

                        markTextNode.splitText(textLength)

                        this.createHighlightElement(
                            markTextNode,
                            highlight.id,
                            highlight.color
                        )
                    }
                })
            })

        const allMarks = R.groupBy(R.path(['dataset', 'id']), this.getMarks())

        const highlights = Object.entries(allMarks).map(([id, marks]) =>
            this.getDataFromMarks(marks, id)
        )

        this.props.setProps({ highlights })
    }

    getNodeFromXpath(xpath) {
        const [endTextNode] = xpath.matchAll('^(.*)/TEXT\\[([0-9]+)\\]$')

        let _, textNodeIndex
        if (endTextNode !== undefined) {
            ;[_, xpath, textNodeIndex] = endTextNode
        }

        const element = this.getDocument().evaluate(
            xpath,
            this.getDocument(),
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue

        if (textNodeIndex !== undefined) {
            for (const node of element.childNodes) {
                if (node.nodeType === 3) {
                    if (textNodeIndex-- === 1) {
                        return node
                    }
                }
            }

            return undefined
        }

        return element
    }

    getXpathFromNode(tag, rootTag = null) {
        if (tag === rootTag) {
            return ''
        } else if (tag.tagName === 'HTML') {
            return '/HTML[1]'
        }

        let tagIndex = 0
        for (const sibling of tag.parentNode.childNodes) {
            if (sibling === tag) {
                const parentXpath = this.getXpathFromNode(
                    tag.parentNode,
                    rootTag
                )
                const tagName = tag.nodeType === 3 ? 'TEXT' : tag.tagName
                return `${parentXpath}/${tagName}[${tagIndex + 1}]`
            } else if (sibling.tagName === tag.tagName) {
                tagIndex++
            }
        }

        return null
    }

    createHighlightElement(node, id, color = null) {
        const highlight = this.getDocument().createElement('mark')
        highlight.className = 'highlight'
        highlight.innerHTML = node.textContent
        highlight.dataset.id = id

        highlight.style.backgroundColor = color || this.props.color
        highlight.style.pointerEvents = 'none'

        highlight.addEventListener('click', () => {
            this.triggerEvent('clicked_highlight', id)
        })

        highlight.addEventListener('mouseover', () => {
            this.triggerEvent('hovered_highlight', id)
        })

        node.parentNode.replaceChild(highlight, node)

        setTimeout(() => {
            highlight.style.pointerEvents = 'auto'
        }, 500)
    }

    getDataFromMarks(marks, id) {
        let color = this.props.color
        let text = ''

        const position = Array.from(marks).map((mark) => {
            const parentNode = mark.parentNode
            let previousTextLength = 0
            text += mark.textContent

            if (mark.style.backgroundColor !== '') {
                color = mark.style.backgroundColor
            }

            for (const childNode of parentNode.childNodes) {
                if (childNode === mark) {break}
                previousTextLength += childNode.textContent.length
            }

            return {
                parentXpath: this.getXpathFromNode(parentNode),
                textLength: mark.textContent.length,
                offset: previousTextLength,
                id: mark.dataset.id,
            }
        })

        return {id, position, text, color}
    }

    getDocument() {
        return this.htmlIframe?.current?.contentDocument
    }

    getMarks(id = null) {
        if (id !== null) {
            return this.getDocument().querySelectorAll(
                `mark.highlight[data-id="${id}"]`
            )
        }

        return this.getDocument().querySelectorAll(`mark.highlight`)
    }

    getHighlightDataById(id) {
        const marks = this.getMarks(id)

        return this.getDataFromMarks(marks, id)
    }

    onMouseUp() {
        const selection = this.htmlIframe.current.contentWindow.getSelection()

        if (selection.toString() !== '') {
            const range = selection.getRangeAt(0)

            this.createHighlightFromRange(range)
        }

        selection.removeAllRanges()
    }

    createHighlightFromRange(range) {
        const nodeIterator = this.getDocument().createNodeIterator(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (range.intersectsNode(node)) {
                        return NodeFilter.FILTER_ACCEPT
                    }

                    return NodeFilter.FILTER_REJECT
                },
            },
            false
        )

        const id = generateId()
        const nodes = []
        let node

        while ((node = nodeIterator.nextNode())) {nodes.push(node)}

        nodes.forEach((node) => {
            if (node === range.endContainer) {
                node.splitText(range.endOffset)
            }

            if (node === range.startContainer) {
                node = node.splitText(range.startOffset)
            }

            this.createHighlightElement(node, id)
        })

        if (nodes.length > 0) {
            const newHighlights = {
                highlights: [
                    ...this.props.highlights,
                    this.getHighlightDataById(id),
                ],
            }

            this.props.setProps(newHighlights)
            this.triggerEvent('new_highlight', id, newHighlights)
        }
    }

    highlight(searchString, color) {
        const regexString = searchString
            .replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
            .replace(' ', ' ?')

        const pattern = new RegExp(regexString, 'gi')

        const nodes = []
        let node, match
        let text = ''

        const nodeIterator = this.getDocument().createNodeIterator(
            this.getDocument().body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        )

        while ((node = nodeIterator.nextNode())) {
            nodes.push({
                textNode: node,
                start: text.length,
            })

            text += node.nodeValue
        }

        if (nodes.length === 0) {
            return
        }

        while ((match = pattern.exec(text))) {
            const {
                index: matchStartIndex,
                0: {length: matchLength},
            } = match
            const matchEndIndex = matchStartIndex + matchLength

            if (matchLength === 0) {
                pattern.lastIndex++
                continue
            }

            const id = generateId()

            for (const [i, node] of nodes.entries()) {
                const {start, textNode} = node
                const textNodeLength = textNode.nodeValue.length

                if (start + textNodeLength <= matchStartIndex) {
                    continue
                }

                if (start >= matchEndIndex) {
                    break
                }

                if (start < matchStartIndex) {
                    nodes.splice(i + 1, 0, {
                        textNode: textNode.splitText(matchStartIndex - start),
                        start: matchStartIndex,
                    })

                    continue
                }

                if (start + textNodeLength > matchEndIndex) {
                    nodes.splice(i + 1, 0, {
                        textNode: textNode.splitText(matchEndIndex - start),
                        start: matchEndIndex,
                    })
                }

                this.createHighlightElement(textNode, id, color)
            }
        }
    }

    triggerEvent(name, value, extraProps = {}) {
        this.props.setProps({
            event: {name, value, _: !this.props.event?._},
            ...extraProps,
        })
    }

    render() {
        const {width, height, data} = this.props

        return (
            <div style={{width, height}}>
                <iframe
                    ref={this.htmlIframe}
                    srcDoc={data}
                    onLoad={this.iframeOnLoad.bind(this)}
                    frameBorder="0"
                    sandbox=""
                    width="100%"
                    height="100%"
                />
            </div>
        )
    }
}

HTMLAnnotator.defaultProps = defaultProps
HTMLAnnotator.propTypes = propTypes
