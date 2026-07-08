import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import FloorSelect from "./pages/FloorSelect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/floors" element={<FloorSelect />} />
    </Routes>
  );
}

export default App;
