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
  const [orderDetails, setOrderDetails] = useState([]);

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
          theme === "light" ? "bg-white text-black" : "bg-black text-white"
        } min-h-screen h-full flex flex-col`}
      >
        <Header
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          sepet={sepet}
          setSepet={setSepet}
        />

        <div className="flex flex-col mt-44 md:mt-2 md:flex-row gap-4 md:gap-6 lg:gap-8 w-full max-w-screen-4xl mx-auto px-4 pt-20 md:pt-32 lg:pt-40 pb-10">
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
