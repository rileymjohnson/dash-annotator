% Auto-generated: do not edit by hand
\name{''DashAnnotator}

\alias{''DashAnnotator}

\title{DashAnnotator component}

\description{
DashAnnotator is used to annotate PDF, HTML, and text files. It accepts a base64 encoding PDF data URL, an HTML string, and a raw text string, respectively.
}

\usage{
''DashAnnotator(id=NULL, color=NULL, data=NULL, data_type=NULL, event=NULL,
height=NULL, highlights=NULL, width=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{color}{Character. Color of highlights.}

\item{data}{Character. Base64 encoded PDF, HTML, or Text string.}

\item{data_type}{Character. Type of data passed (pdf, html, text).}

\item{event}{Named list. Name of event that has occurred.}

\item{height}{Character. Height of annotator container.}

\item{highlights}{Unnamed list. List of highlights applied to text.}

\item{width}{Character. Width of annotator container.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

