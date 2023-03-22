# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class TextAnnotator(Component):
    """A TextAnnotator component.
TextAnnotator is used to annotate text. It renders
a text string, which the user can highlight.
Note: this class is the same as the `HTMLAnnotator`
class, except it accepts text instead of HTML and
passes that text to the `HTMLAnnotator` wrapped
in a `<pre />` tag.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- color (string; default 'lightcoral'):
    Color of highlights.

- data (string; optional):
    Text string.

- event (dict; optional):
    Name of event that has occurred.

- height (string; default '100vh'):
    Height of annotator container.

- highlights (list; optional):
    List of highlights applied to text.

- width (string; default '100%'):
    Width of annotator container."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_annotator'
    _type = 'TextAnnotator'
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, highlights=Component.UNDEFINED, color=Component.UNDEFINED, event=Component.UNDEFINED, data=Component.UNDEFINED, height=Component.UNDEFINED, width=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'color', 'data', 'event', 'height', 'highlights', 'width']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'color', 'data', 'event', 'height', 'highlights', 'width']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(TextAnnotator, self).__init__(**args)
