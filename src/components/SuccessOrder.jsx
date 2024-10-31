function SuccessOrder({ orderDetails }) {
  const { sepet, selectedAdres, timestamp } = orderDetails; // timestamp değişti
  console.log("sepet details", sepet);
  console.log("adres details", selectedAdres);
  console.log(timestamp);

  return (
    <div className="flex flex-col gap-4">
      <h1>Sipariş Özeti</h1>
      <h2>{new Date(timestamp).toLocaleString()}</h2>{" "}
      {/* timestamp'ı formatlayarak göster */}
      {sepet.map((item) => (
        <div
          className="flex items-center gap-4 border-2 p-2 w-full"
          key={item.id}
        >
          <img src={item.image} className="w-20 h-20" alt={item.title} />
          <p>{item.title}</p>
        </div>
      ))}
      {/* selectedAdres bir nesne ise direkt erişim yapmalısınız */}
      <div className="border rounded-lg flex flex-col gap-2 border-black p-4">
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
