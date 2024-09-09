# 2 PDF highlighter Implmentations

## Plain Impl (old pdf.js version) (simpleviewer.html)

- Uses decrepated `findController.executeCommand("find", args)`
- Scrolls into view correctly
- Line breaks needs a <20> (space) in order to be highlighted (i.e. copying from pdf render and searching wont work, but adding a space to each line break will)
- Searches for the first instance of the phrase and highlights it, (or all, configurable)
- Can style the highlight as pdfjs renders the highlights into spans

## Plain Impl (new pdf.js version) (newviewer.html)

- Uses `eventBus.dispatch("find", args)`
- Works correctly, and scrolls into view correctly

## React Impl (latest pdfjs-dist)

- Uses `eventBus.dispatch("find", args)`
- Unmounts incorrectly, when re-mounting in strictmode dev mode it renders the pages twice, used hack workaround that sets the container's ref's innerHTML to initial when unmounting component
- Scrolls into view correctly, (but still logs error `offsetParent is not set -- cannot scroll` to console?)
- caveat: can only fire find event a delay after the pagesinit event or else it does not scroll into view

### Extras

Classes to style:
classes for first match: `highlight selected appended`
classes for other matches: `highlight appended`
