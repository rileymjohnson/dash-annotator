# AUTO GENERATED FILE - DO NOT EDIT

export ''_dashannotator

"""
    ''_dashannotator(;kwargs...)

A DashAnnotator component.
DashAnnotator is used to annotate PDF, HTML,
and text files. It accepts a base64 encoding
PDF data URL, an HTML string, and a raw text
string, respectively.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `color` (String; optional): Color of highlights.
- `data` (String; optional): Base64 encoded PDF, HTML, or Text string.
- `data_type` (String; optional): Type of data passed (pdf, html, text).
- `event` (Dict; optional): Name of event that has occurred.
- `height` (String; optional): Height of annotator container.
- `highlights` (Array; optional): List of highlights applied to text.
- `width` (String; optional): Width of annotator container.
"""
function ''_dashannotator(; kwargs...)
        available_props = Symbol[:id, :color, :data, :data_type, :event, :height, :highlights, :width]
        wild_props = Symbol[]
        return Component("''_dashannotator", "DashAnnotator", "dash_annotator", available_props, wild_props; kwargs...)
end

