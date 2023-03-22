# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''DashAnnotator <- function(id=NULL, color=NULL, data=NULL, data_type=NULL, event=NULL, height=NULL, highlights=NULL, width=NULL) {
    
    props <- list(id=id, color=color, data=data, data_type=data_type, event=event, height=height, highlights=highlights, width=width)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashAnnotator',
        namespace = 'dash_annotator',
        propNames = c('id', 'color', 'data', 'data_type', 'event', 'height', 'highlights', 'width'),
        package = 'dashAnnotator'
        )

    structure(component, class = c('dash_component', 'list'))
}
