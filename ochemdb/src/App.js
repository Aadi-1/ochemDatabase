import "./App.css";
import NavBar from "./NavBar";
import About from "./pages/About";
import Instructions from "./pages/Instructions";
import RequestChemical from "./pages/RequestChemical";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCart } from "./CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();
}

function App() {
  let Component;
  switch (window.location.pathname) {
    case "/":
      Component = Home;
      break;
    case "/about":
      Component = About;
      break;
    case "/instructions":
      Component = Instructions;
      break;
    case "/request":
      Component = RequestChemical;
      break;
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <Component />
      </div>
    </>
  );
}

export default App;
