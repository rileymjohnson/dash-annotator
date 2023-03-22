import React from 'react'

export const DashAnnotator = React.lazy(() =>
    import(
        /* webpackChunkName: "DashAnnotator" */ './fragments/DashAnnotator.react'
    )
)
export const HTMLAnnotator = React.lazy(() =>
    import(
        /* webpackChunkName: "DashAnnotator" */ './fragments/HTMLAnnotator.react'
    )
)
export const TextAnnotator = React.lazy(() =>
    import(
        /* webpackChunkName: "DashAnnotator" */ './fragments/TextAnnotator.react'
    )
)
export const PDFAnnotator = React.lazy(() =>
    import(
        /* webpackChunkName: "DashAnnotator" */ './fragments/PDFAnnotator.react'
    )
)
