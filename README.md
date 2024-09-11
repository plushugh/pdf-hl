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

## Matching LLM output to pdf Highlight

Use some kind of levenshtein distance algorithm + sliding window to find
closest substring in the search text

Get text to fuzzy search against:

Do `pdfFindController.#extractText();`

which would be called when we first dispatch find event by pdfjs *internally*
Can't call directyly since its **private**
could just search ""

then the full text would be in

`pdfFindController._pageContents: string[]` (indexed by page number)

the controller will use this to search against *internally* by pdfjs

```python
import rapidfuzz

def find_closest_substring_rapidfuzz(pdf_text, target_string):
    chars = list(pdf_text)
    target_length = len(target_string)

    best_match = None
    best_score = -1

    for i in range(len(chars) - target_length + 1):
        window_text = "".join(chars[i : i + target_length])
        score = rapidfuzz.fuzz.ratio(window_text, target_string)

        if score > best_score:
            best_score = score
            best_match = window_text

    return best_match


with open("source.txt", "r") as f:
    with open("match.txt", "r") as f2:
        pdf_text = f.read()
        target_string = f2.read()
        closest_match_rf = find_closest_substring_rapidfuzz(pdf_text, target_string)
        print("                      Source:", target_string)
        print("Closest Match with RapidFuzz:", closest_match_rf)
```

As long as the text to be queryed in PDFJS is a substring of `pdfFindController._pageContents` AND that it does not cross pages, the search will correctly highlight the text

> [!IMPORTANT]
> NOTE: matched by fixed-length sliding window, so spaces & newline differences will result in over/under highlighting

When the PDF is long, the matching -> searching done at client side is slow

If the highlighting is one-and-done then this is fine

If doing at server-side, we will need the pdf's text to search against, from PDFJS's viewer's findcontroller
