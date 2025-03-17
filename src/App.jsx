"use client";

import { useEffect, useState } from "react";
import { useLocaleStorage } from "./hooks/useLocaleStorage";
import Header from "./layouts/Header";
import MainContent from "./layouts/MainContent";
import Sidebar from "./layouts/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "./context/ThemeContext";

const queryClient = new QueryClient();

function App() {
  const [loggedUser, setLoggedUser] = useLocaleStorage("user", "");
  const [sepet, setSepet] = useLocaleStorage("sepet", []);
  const [sideBarFilter, setSideBarFilter] = useState([]);
  const [adresInfo, setAdresInfo] = useLocaleStorage("adres", []);
  const [orderDetails, setOrderDetails] = useLocaleStorage("orders", []);
  const [selectedAdres, setSelectedAdres] = useLocaleStorage(
    "selectedAdres",
    null
  );
  const [cardInfo, setCardInfo] = useLocaleStorage("myCard", null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!sepet) {
      setSepet([]);
    }
  }, [sepet]);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`${
          theme === "light"
            ? "bg-gray-50 text-gray-900"
            : "bg-gray-900 text-gray-100"
        } min-h-screen transition-colors duration-300`}
      >
        <Header
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          sepet={sepet}
          setSepet={setSepet}
        />

        <div className="container mx-auto px-4 pt-24 pb-10 flex flex-col md:flex-row gap-6">
          <Sidebar
            loggedUser={loggedUser}
            sideBarFilter={sideBarFilter}
            setSideBarFilter={setSideBarFilter}
            sepet={sepet}
            selectedAdres={selectedAdres}
            setSelectedAdres={setSelectedAdres}
            cardInfo={cardInfo}
            setCardInfo={setCardInfo}
            setSepet={setSepet}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
          />
          <MainContent
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            sepet={sepet}
            setSepet={setSepet}
            sideBarFilter={sideBarFilter}
            adresInfo={adresInfo}
            setAdresInfo={setAdresInfo}
            selectedAdres={selectedAdres}
            setSelectedAdres={setSelectedAdres}
            cardInfo={cardInfo}
            setCardInfo={setCardInfo}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
