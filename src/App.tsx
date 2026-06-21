import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Work from "./pages/Work";
import Impact from "./pages/Impact";
import Process from "./pages/Process";
import Report from "./pages/Report";
import SeekHelp from "./pages/SeekHelp";
import Track from "./pages/Track";
import Dashboard from "./pages/Dashboard";
import Volunteer from "./pages/Volunteer";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Admin — no nav/footer wrapper */}
      <Route path="/admin" element={<Admin />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/seek-help" element={<SeekHelp />} />
        <Route path="/track" element={<Track />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/process" element={<Process />} />
        <Route path="/report" element={<Report />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
