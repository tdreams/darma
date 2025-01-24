import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import NotifyMe from "./components/NotifyMe";
import { Route, Routes } from "react-router-dom";
import ReturnForm from "./components/ReturnForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {" "}
        {/* Add flex-grow to push footer down */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <HowItWorks />
                <NotifyMe />
              </>
            }
          />
          <Route path="/schedule-return" element={<ReturnForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
