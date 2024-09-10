import { useState } from "react";
import "./App.css";
import PDFHL from "./PDFHL";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{}}>
        <input
          type="text"
          onChange={(ev) => setSearchTerm(ev.target.value)}
        ></input>
      </div>
      <div
        style={{
          position: "relative",
          height: "600px",
          width: "400px",
          backgroundColor: "#2f2f2f",
        }}
      >
        <PDFHL pdfUrl="/test.pdf" highlightSearch={searchTerm} />
      </div>
    </main>
  );
}

export default App;
