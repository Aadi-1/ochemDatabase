import "./App.css";
import NavBar from "./NavBar";
import About from "./pages/About";
import Instructions from "./pages/Instructions";
import RequestChemical from "./pages/RequestChemical";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { useCart } from "./CartContext";
import Table from "./pages/table.js";

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/request" element={<RequestChemical />} />
          <Route path="/table" element={<Table />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
