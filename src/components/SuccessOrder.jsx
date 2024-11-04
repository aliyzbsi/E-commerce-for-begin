import { useTheme } from "../context/ThemeContext";

function SuccessOrder({ orderDetails }) {
  const { sepet, selectedAdres, timestamp } = orderDetails;
  console.log("sepet details", sepet);
  console.log("adres details", selectedAdres);
  console.log(timestamp);
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col gap-6 p-4 max-w-6xl mx-auto `}
    >
      <h1 className="text-2xl font-bold">Sipariş Özeti</h1>
      <h2>{new Date(timestamp).toLocaleString()}</h2>

      {sepet.map((item) => (
        <div
          className="flex items-center gap-4 border-b border-gray-300 p-2 w-full transition duration-200 hover:bg-gray-100"
          key={item.id}
        >
          <img
            src={item.image}
            className="w-24 h-24 object-cover rounded-lg shadow-md"
            alt={item.title}
          />
          <p className="text-lg font-semibold">{item.title}</p>
        </div>
      ))}

      <div className="border rounded-lg border-gray-300 p-4  shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Adres Bilgileri</h3>
        <p>
          <span className="font-bold">Ad Soyad:</span>{" "}
          <span className="text-base font-normal">
            {selectedAdres.name} {selectedAdres.surname}
          </span>
        </p>
        <p>
          <span className="font-bold">Adres Tipi:</span>{" "}
          <span className="text-base font-normal">
            {selectedAdres.adresBasligi}
          </span>
        </p>
        <p>
          <span className="font-bold">Adres:</span>{" "}
          <span className="text-base font-normal">
            {selectedAdres.adresInfo}
          </span>
        </p>
        <p>
          <span className="font-bold">İl / İlçe:</span>{" "}
          <span className="text-base font-normal">
            {selectedAdres.city}/{selectedAdres.town}
          </span>
        </p>
      </div>
    </div>
  );
}

export default SuccessOrder;
