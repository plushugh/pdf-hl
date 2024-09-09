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
- Search behavior is the same, but does not scroll into view correctly, maybe due to styling `position: absolute` or `offsetParent is not set -- cannot scroll` error when scrolling, but seems to be triggered by the following stacktrace

```
offsetParent is not set -- cannot scroll
scrollIntoView @ pdfjs-dist_web_pdf_v…s.js?v=229923c0:167
scrollIntoView_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:7986
resetCurrentPageView_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:8115
_setCurrentPageNumber @ pdfjs-dist_web_pdf_v….js?v=229923c0:6779
set currentPageNumber @ pdfjs-dist_web_pdf_v….js?v=229923c0:6771
set page @ pdfjs-dist_web_pdf_v….js?v=229923c0:1358
updatePage_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1129
updateMatch_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1251
matchesReady_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1197
nextPageMatch_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1222
calculateMatch_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1080
(anonymous) @ pdfjs-dist_web_pdf_v….js?v=229923c0:1166
Promise.then  
nextMatch_fn @ pdfjs-dist_web_pdf_v….js?v=229923c0:1164
(anonymous) @ pdfjs-dist_web_pdf_v…s.js?v=229923c0:907
setTimeout  
(anonymous) @ pdfjs-dist_web_pdf_v…s.js?v=229923c0:906
Promise.then  
onFind_fn @ pdfjs-dist_web_pdf_v…s.js?v=229923c0:894
dispatch @ pdfjs-dist_web_pdf_v….js?v=229923c0:1955
onClick @ PDFHL.tsx:89
callCallback2 @ react-dom_client.js?v=229923c0:3674
invokeGuardedCallbackDev @ react-dom_client.js?v=229923c0:3699
invokeGuardedCallback @ react-dom_client.js?v=229923c0:3733
invokeGuardedCallbackAndCatchFirstError @ react-dom_client.js?v=229923c0:3736
executeDispatch @ react-dom_client.js?v=229923c0:7014
processDispatchQueueItemsInOrder @ react-dom_client.js?v=229923c0:7034
processDispatchQueue @ react-dom_client.js?v=229923c0:7043
dispatchEventsForPlugins @ react-dom_client.js?v=229923c0:7051
(anonymous) @ react-dom_client.js?v=229923c0:7174
batchedUpdates$1 @ react-dom_client.js?v=229923c0:18913
batchedUpdates @ react-dom_client.js?v=229923c0:3579
dispatchEventForPluginEventSystem @ react-dom_client.js?v=229923c0:7173
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom_client.js?v=229923c0:5478
dispatchEvent @ react-dom_client.js?v=229923c0:5472
dispatchDiscreteEvent
```
