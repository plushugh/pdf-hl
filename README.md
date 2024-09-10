# PDF highlighter Implmentations

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
- ~~Unmounts incorrectly, when re-mounting in strictmode dev mode it renders the pages twice, used hack workaround that sets the container's ref's innerHTML to initial when unmounting component~~
- ~~Scrolls into view correctly, (but still logs error `offsetParent is not set -- cannot scroll` to console?)~~ Fixed by cleanup, some errors when HMR-ing, no issues in prod

### Extras

[List of EventBus events](list-of-eventbus-events.md)

Classes to style:

classes for first match: `highlight selected appended`

classes for a multiline match `highlight (end|start|middle) selected appended`

classes for other matches: `highlight appended`

---

Variables to style (defaults with pdfjs viewer.css):

```css
.textLayer .highlight {
  --highlight-bg-color: rgb(180 0 170 / 0.25);
  --highlight-selected-bg-color: rgb(0 100 0 / 0.25);
  --highlight-backdrop-filter: none;
  --highlight-selected-backdrop-filter: none;
}
```

### Running

- Plain impls: run a webserver at repo root: `npx http-server`
- React impl: `cd react && pnpm i && pnpm dev`
