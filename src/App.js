import React from "react";
import Splash from "./pages/Splash.js";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Browse from "./components/Browse";
import Arrived from "./components/Arrived";
import Clients from "./components/Clients";
import AsideMenu from "./components/AsideMenu";
import Footer from "./components/Footer";
import Offline from "./components/Offline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";

function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const [splashStatus, setSplashStatus] = React.useState(true);

  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(() => {
    (async () => {

      try {
        const response = await fetch('https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc', {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'x-api-key': process.env.REACT_APP_APIKEY
          }
        });
        
              const { nodes } = await response.json();
        
              if(nodes) {
                setItems(nodes);
              } else{
                setItems([])
              }
      } catch (error) {
        console.log(error)
      }

      const script = document.createElement("script");
      script.src = "/carousel.js";
      script.async = false;
      document.body.appendChild(script);

      handleOfflineStatus();
      window.addEventListener("online", handleOfflineStatus);
      window.addEventListener("offline", handleOfflineStatus);

      setTimeout(() => {
        setSplashStatus(false);
      }, 1500);

      return function () {
        window.removeEventListener("online", handleOfflineStatus);
        window.removeEventListener("offline", handleOfflineStatus);
      };
    })();
  }, [offlineStatus]);

  return (
    <>
      {splashStatus === true ? (
        <Splash />
      ) : (
        <>
          {offlineStatus && <Offline />}
          <Header />
          <Hero />
          <Browse />
          <Arrived items={items} />
          <Clients />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <>
        <Route path="/" exact element={<App/>} />
        <Route path="/profile" exact element={<Profile/>} />
        </>
      </Routes>
    </Router>
  );
}
