import {Component} from 'react'

export default class Highlight extends Component {
    render() {
        const {position, onClick, onMouseOver, onMouseOut, color, id} = this.props

        return (
            <div
                data-id={id}
                onMouseLeave={onMouseOut}
            >
                {position.rects.map((rect, index) => (
                    <div
                        onMouseOver={onMouseOver}
                        onClick={onClick}
                        key={index}
                        style={{
                            background: color,
                            ...rect,
                        }}
                        className="highlight"
                    />
                ))}
            </div>
        )
    }
}
