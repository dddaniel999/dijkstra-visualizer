import "./App.css";
import { Routes, Route } from "react-router-dom";
import BasicVisualisation from "./pages/BasicVis";
import InteractiveDijkstra from "./pages/InteractiveDijkstra";
import AppLayout from "./components/AppLayout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AppLayout>
      <Navbar />
      <main className="mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<BasicVisualisation />} />
          <Route path="/interactive" element={<InteractiveDijkstra />} />
        </Routes>
      </main>
    </AppLayout>
  );
}

export default App;
