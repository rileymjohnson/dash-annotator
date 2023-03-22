# AUTO GENERATED FILE - DO NOT EDIT

export ''_textannotator

"""
    ''_textannotator(;kwargs...)

A TextAnnotator component.
TextAnnotator is used to annotate text. It renders
a text string, which the user can highlight.
Note: this class is the same as the `HTMLAnnotator`
class, except it accepts text instead of HTML and
passes that text to the `HTMLAnnotator` wrapped
in a `<pre />` tag.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `color` (String; optional): Color of highlights.
- `data` (String; optional): Text string.
- `event` (Dict; optional): Name of event that has occurred.
- `height` (String; optional): Height of annotator container.
- `highlights` (Array; optional): List of highlights applied to text.
- `width` (String; optional): Width of annotator container.
"""
function ''_textannotator(; kwargs...)
        available_props = Symbol[:id, :color, :data, :event, :height, :highlights, :width]
        wild_props = Symbol[]
        return Component("''_textannotator", "TextAnnotator", "dash_annotator", available_props, wild_props; kwargs...)
end

