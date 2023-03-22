# AUTO GENERATED FILE - DO NOT EDIT

export ''_htmlannotator

"""
    ''_htmlannotator(;kwargs...)

A HTMLAnnotator component.
HTMLAnnotator is used to annotate HTML. It renders
an HTML string, which the user can highlight.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `color` (String; optional): Color of highlights.
- `data` (String; optional): HTML string.
- `event` (Dict; optional): Name of event that has occurred.
- `height` (String; optional): Height of annotator container.
- `highlights` (Array; optional): List of highlights applied to text.
- `width` (String; optional): Width of annotator container.
"""
function ''_htmlannotator(; kwargs...)
        available_props = Symbol[:id, :color, :data, :event, :height, :highlights, :width]
        wild_props = Symbol[]
        return Component("''_htmlannotator", "HTMLAnnotator", "dash_annotator", available_props, wild_props; kwargs...)
end

