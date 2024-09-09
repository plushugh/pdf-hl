import "./App.css";
import PDFHL from "./PDFHL";

function App() {
  return (
    <>
      <PDFHL pdfUrl="/test.pdf" highlightSearch="Jikes" />
    </>
  );
}

export default App;
