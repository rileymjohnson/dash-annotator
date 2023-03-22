% Auto-generated: do not edit by hand
\name{''PDFAnnotator}

\alias{''PDFAnnotator}

\title{PDFAnnotator component}

\description{
PDFAnnotator is used to annotate PDF files. It renders a base64 encoded  PDF data url, which the user can highlight.
}

\usage{
''PDFAnnotator(id=NULL, color=NULL, data=NULL, event=NULL, height=NULL,
highlights=NULL, width=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{color}{Character. Color of highlights.}

\item{data}{Character. Base64 encoded PDF string.}

\item{event}{Named list. Name of event that has occurred.}

\item{height}{Character. Height of annotator container.}

\item{highlights}{Unnamed list. List of highlights applied to text.}

\item{width}{Character. Width of annotator container.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

