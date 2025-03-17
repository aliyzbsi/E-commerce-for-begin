import { useNavigate } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

function OrderFailed() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Sipariş Başarısız
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Siparişiniz işlenirken bir hata oluştu. Lütfen daha sonra tekrar
        deneyiniz veya müşteri hizmetleriyle iletişime geçiniz.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/sepet")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <FaArrowLeft />
          <span>Sepete Dön</span>
        </button>
      </div>
    </div>
  );
}

export default OrderFailed;
