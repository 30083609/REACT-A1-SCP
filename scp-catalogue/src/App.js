import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SCPList from "./SCPList";
import SCPDetails from "./SCPDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SCPList />} />
        <Route path="/scp/:id" element={<SCPDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
