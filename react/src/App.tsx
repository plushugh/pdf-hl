import "./App.css";
import PDFHL from "./PDFHL";

function App() {
  return (
    <>
      <PDFHL
        pdfUrl="/test.pdf"
        highlightSearch="
CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING,
WITHOUT LIMITATION, ANY WARRANTIES OR CONDITIONS OF TITLE, NON-
INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
NEITHER APPLE"
      />
    </>
  );
}

export default App;
