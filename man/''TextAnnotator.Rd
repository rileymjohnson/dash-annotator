% Auto-generated: do not edit by hand
\name{''TextAnnotator}

\alias{''TextAnnotator}

\title{TextAnnotator component}

\description{
TextAnnotator is used to annotate text. It renders a text string, which the user can highlight. Note: this class is the same as the `HTMLAnnotator` class, except it accepts text instead of HTML and passes that text to the `HTMLAnnotator` wrapped in a `<pre />` tag.
}

\usage{
''TextAnnotator(id=NULL, color=NULL, data=NULL, event=NULL, height=NULL,
highlights=NULL, width=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{color}{Character. Color of highlights.}

\item{data}{Character. Text string.}

\item{event}{Named list. Name of event that has occurred.}

\item{height}{Character. Height of annotator container.}

\item{highlights}{Unnamed list. List of highlights applied to text.}

\item{width}{Character. Width of annotator container.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

