import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Basket from "../components/Basket";
import ProductItem from "../components/ProductItem";
import AdresForm from "../components/AdresForm";
import PaymentInfo from "../components/PaymentInfo";
import { useTheme } from "../context/ThemeContext";
import OrderFailed from "../components/OrderFailed";
import SuccessOrder from "../components/SuccessOrder";
import Favorites from "../pages/Favorites";
import SearchResults from "../pages/SearchResults";
import UserProfile from "../pages/UserProfile";
import NotFound from "../pages/NotFound";

function MainContent({
  loggedUser,
  sideBarFilter,
  setLoggedUser,
  sepet,
  setSepet,
  adresInfo,
  setAdresInfo,
  selectedAdres,
  setSelectedAdres,
  cardInfo,
  setCardInfo,
  orderDetails,
  setOrderDetails,
}) {
  const { theme } = useTheme();

  return (
    <main
      className={`
        w-full md:w-2/3 lg:w-3/4 
        ${theme === "light" ? "bg-white" : "bg-gray-800"}
        rounded-xl shadow-md p-4 md:p-6 transition-colors duration-300
      `}
    >
      <Routes>
        {/* Herkes tarafından erişilebilen rotalar */}
        <Route
          path="/"
          element={
            <Home
              sepet={sepet}
              setSepet={setSepet}
              sideBarFilter={sideBarFilter}
              loggedUser={loggedUser}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductItem
              sepet={sepet}
              setSepet={setSepet}
              loggedUser={loggedUser}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
          }
        />

        {/* Sadece giriş yapmış kullanıcılar için rotalar */}
        <Route
          path="/favorites"
          element={
            <Favorites
              sepet={sepet}
              setSepet={setSepet}
              loggedUser={loggedUser}
            />
          }
        />
        <Route
          path="/profile"
          element={
            loggedUser ? (
              <UserProfile
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                addressInfo={adresInfo}
                setAddressInfo={setAdresInfo}
                cardInfo={cardInfo}
                setCardInfo={setCardInfo}
              />
            ) : (
              <Navigate to="/login" state={{ from: "/profile" }} replace />
            )
          }
        />
        <Route
          path="/search"
          element={
            <SearchResults
              sepet={sepet}
              setSepet={setSepet}
              loggedUser={loggedUser}
            />
          }
        />
        <Route
          path="/sepet"
          element={
            loggedUser ? (
              <Basket
                sepet={sepet}
                loggedUser={loggedUser}
                setSepet={setSepet}
              />
            ) : (
              <Navigate to="/login" state={{ from: "/sepet" }} replace />
            )
          }
        />

        <Route
          path="/sepet/adres"
          element={
            loggedUser ? (
              sepet.length > 0 ? (
                <AdresForm
                  sepet={sepet}
                  setSepet={setSepet}
                  adresInfo={adresInfo}
                  setAdresInfo={setAdresInfo}
                  setLoggedUser={setLoggedUser}
                  loggedUser={loggedUser}
                  selectedAdres={selectedAdres}
                  setSelectedAdres={setSelectedAdres}
                />
              ) : (
                <Navigate to="/sepet" replace />
              )
            ) : (
              <Navigate to="/login" state={{ from: "/sepet/adres" }} replace />
            )
          }
        />

        <Route
          path="/sepet/odeme"
          element={
            loggedUser ? (
              selectedAdres ? (
                <PaymentInfo cardInfo={cardInfo} setCardInfo={setCardInfo} />
              ) : (
                <Navigate to="/sepet/adres" replace />
              )
            ) : (
              <Navigate to="/login" state={{ from: "/sepet/odeme" }} replace />
            )
          }
        />

        <Route
          path="/order-success"
          element={
            loggedUser ? (
              <SuccessOrder
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/failed-order"
          element={
            loggedUser ? <OrderFailed /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default MainContent;
