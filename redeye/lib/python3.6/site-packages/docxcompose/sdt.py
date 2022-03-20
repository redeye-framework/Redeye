from docxcompose.utils import xpath


class StructuredDocumentTags(object):
    """Structured Document Tags (aka Content Controls)"""

    def __init__(self, doc):
        self.doc = doc

    def tags_by_alias(self, alias):
        """Get Structured Document Tags by alias."""
        return xpath(
            self.doc.element.body,
            './/w:sdt/w:sdtPr/w:alias[@w:val="%s"]/ancestor::w:sdt' % alias)

    def set_text(self, alias, text):
        """Set the text content of all Structured Document Tags identified by
           an alias. Only plain text SDTs are supported.
        """
        tags = self.tags_by_alias(alias)
        for tag in tags:
            # Ignore if it's not a plain text SDT
            if not xpath(tag, './w:sdtPr/w:text'):
                continue
            content = xpath(tag, './w:sdtContent')
            if not content:
                continue
            showing_placeholder = xpath(tag, './w:sdtPr/w:showingPlcHdr')
            text_elements = xpath(content[0], './/w:r/w:t')
            if text_elements:
                text_elements[0].text = text
                if showing_placeholder:
                    # Remove placeholder marker and style
                    showing_placeholder[0].getparent().remove(
                        showing_placeholder[0])
                    run_props = xpath(text_elements[0].getparent(), './w:rPr')
                    if run_props:
                        text_elements[0].getparent().remove(run_props[0])
            # Remove any other text elements
            if len(text_elements) > 1:
                for el in text_elements[1:]:
                    if el.getparent() == text_elements[0].getparent():
                        el.getparent().remove(el)
                    else:
                        el.getparent().getparent().remove(el.getparent())

    def get_text(self, alias):
        """Get the text content of the first Structured Document Tag identified
           by the given alias.
        """
        tags = self.tags_by_alias(alias)
        for tag in tags:
            # Ignore if it's not a plain text SDT
            if not xpath(tag, './w:sdtPr/w:text'):
                continue
            text_elements = xpath(tag, './w:sdtContent//w:r/w:t')
            if text_elements:
                return text_elements[0].text
