# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashAnnotator(Component):
    """A DashAnnotator component.
DashAnnotator is used to annotate PDF, HTML,
and text files. It accepts a base64 encoding
PDF data URL, an HTML string, and a raw text
string, respectively.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- color (string; default 'lightcoral'):
    Color of highlights.

- data (string; optional):
    Base64 encoded PDF, HTML, or Text string.

- data_type (string; optional):
    Type of data passed (pdf, html, text).

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
    _type = 'DashAnnotator'
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, highlights=Component.UNDEFINED, color=Component.UNDEFINED, event=Component.UNDEFINED, data=Component.UNDEFINED, data_type=Component.UNDEFINED, height=Component.UNDEFINED, width=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'color', 'data', 'data_type', 'event', 'height', 'highlights', 'width']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'color', 'data', 'data_type', 'event', 'height', 'highlights', 'width']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashAnnotator, self).__init__(**args)
