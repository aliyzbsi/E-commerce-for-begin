import { useState } from "react";
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
  const [selectedAdres, setSelectedAdres] = useLocaleStorage(
    "selectedAdres",
    null
  );
  const { theme } = useTheme();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div
          className={
            theme === "light"
              ? "bg-white text-black h-full"
              : "bg-black text-white h-full"
          }
        >
          <Header
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            sepet={sepet}
            setSepet={setSepet}
          />

          <div className="flex flex-col md:flex-row gap-2 ">
            <Sidebar
              loggedUser={loggedUser}
              sideBarFilter={sideBarFilter}
              setSideBarFilter={setSideBarFilter}
              sepet={sepet}
              selectedAdres={selectedAdres}
              setSelectedAdres={setSelectedAdres}
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
            />
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
