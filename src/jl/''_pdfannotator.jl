# AUTO GENERATED FILE - DO NOT EDIT

export ''_pdfannotator

"""
    ''_pdfannotator(;kwargs...)

A PDFAnnotator component.
PDFAnnotator is used to annotate PDF files. It
renders a base64 encoded  PDF data url, which
the user can highlight.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `color` (String; optional): Color of highlights.
- `data` (String; optional): Base64 encoded PDF string.
- `event` (Dict; optional): Name of event that has occurred.
- `height` (String; optional): Height of annotator container.
- `highlights` (Array; optional): List of highlights applied to text.
- `width` (String; optional): Width of annotator container.
"""
function ''_pdfannotator(; kwargs...)
        available_props = Symbol[:id, :color, :data, :event, :height, :highlights, :width]
        wild_props = Symbol[]
        return Component("''_pdfannotator", "PDFAnnotator", "dash_annotator", available_props, wild_props; kwargs...)
end

