import { useState } from "react";
import "./App.css";
import PDFHL from "./PDFHL";

function App() {
  const [searchTerm, setSearchTerm] = useState("n pragt, das au");
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <div style={{}}>
        <input
          type="text"
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        ></input>
      </div>
      <div
        style={{
          position: "relative",
          height: "1000px",
          width: "800px",
          backgroundColor: "#2f2f2f",
        }}
      >
        <PDFHL pdfUrl="/test3.pdf" highlightSearch={searchTerm} />
      </div>
    </main>
  );
}

export default App;
