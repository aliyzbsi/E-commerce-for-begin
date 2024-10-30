/*
import { useState } from "react";
import { useLocaleStorage } from "../hooks/useLocaleStorage";
import Header from "./Header";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";

function PageAll() {
  const [loggedUser, setLoggedUser] = useLocaleStorage("user", "");
  const [sepet, setSepet] = useLocaleStorage("sepet", []);
  const [sideBarFilter, setSideBarFilter] = useState([]);
  const [adresInfo, setAdresInfo] = useLocaleStorage("adres", []);
  const { theme } = useTheme();
  return (
    <div className=" h-screen ">
      <div
        className={
          theme === "light" ? "bg-white text-black" : "bg-black text-white"
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
          />
          <MainContent
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            sepet={sepet}
            setSepet={setSepet}
            sideBarFilter={sideBarFilter}
            adresInfo={adresInfo}
            setAdresInfo={setAdresInfo}
          />
        </div>
      </div>
    </div>
  );
}

export default PageAll;
*/
