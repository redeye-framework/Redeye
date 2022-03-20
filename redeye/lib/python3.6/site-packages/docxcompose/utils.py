from docx.oxml.xmlchemy import BaseOxmlElement
from docx.oxml.ns import nsmap
import re

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'asvg': 'http://schemas.microsoft.com/office/drawing/2016/SVG/main',
    'cp': 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties',
    'o': 'urn:schemas-microsoft-com:office:office',
    'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'v': 'urn:schemas-microsoft-com:vml',
    'vt': 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'dgm': 'http://schemas.openxmlformats.org/drawingml/2006/diagram',
}
nsmap.update(NS)


def xpath(element, xpath_str):
    """Performs an XPath query on the given element and returns all matching
       elements.
       Works with lxml.etree._Element and with
       docx.oxml.xmlchemy.BaseOxmlElement elements.
    """
    if isinstance(element, BaseOxmlElement):
        return element.xpath(xpath_str)
    else:
        return element.xpath(xpath_str, namespaces=NS)


# Format specifications for docproperties can be found at
# https://support.microsoft.com/en-us/office/format-field-results-baa61f5a-5636-4f11-ab4f-6c36ae43508c?ui=en-US&rs=en-US&ad=US#ID0EAABAAA=Date-Time_format_switch_(\@)
date_format_map = (
    ('Y', 'y'),  # Upper or lower case Y are equivalent
    ('yyyy', '%Y'),
    ('yy', '%y'),
    ('MMMM', '%B'),
    ('MMM', '%b'),
    ('MM', '%m'),
    ('M', '%-%m'),  # We use '%-%m' instead of '%-m' to facilitate negative lookbehind
    ('d', 'D'),  # Upper or lower case D are equivalent
    ('DDDD', '%A'),
    ('DDD', '%a'),
    ('DD', '%d'),
    ('D', '%-d'),
    ('H', 'h'),  # Upper or lower case H are equivalent
    ('hh', '%H'),
    ('h', '%-H'),
    ('(?<!%)mm', '%M'),
    ('(?<!%)m', '%-M'),
    ('%-%m', '%-m'),  # Now that we've done the negative lookbehind we can set month format correctly
    ('ss', '%S'),
    ('s', '%-S'),
)


def word_to_python_date_format(format_str):
    for word_format, python_format in date_format_map:
        format_str = re.sub(word_format, python_format, format_str)
    return format_str
