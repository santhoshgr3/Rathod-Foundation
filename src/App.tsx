import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Work = lazy(() => import("./pages/Work"));
const Impact = lazy(() => import("./pages/Impact"));
const Process = lazy(() => import("./pages/Process"));
const Report = lazy(() => import("./pages/Report"));
const SeekHelp = lazy(() => import("./pages/SeekHelp"));
const Track = lazy(() => import("./pages/Track"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Admin = lazy(() => import("./pages/Admin"));
const QRCodePage = lazy(() => import("./pages/QRCode"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: "var(--color-saffron)", borderTopColor: "transparent" }} />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* Admin — no nav/footer wrapper */}
        <Route path="/admin" element={<Admin />} />
        {/* QR code — standalone printable page */}
        <Route path="/qr" element={<QRCodePage />} />

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
    </Suspense>
  );
}
