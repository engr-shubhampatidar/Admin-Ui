import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./admin-page/admin-page-ui";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
