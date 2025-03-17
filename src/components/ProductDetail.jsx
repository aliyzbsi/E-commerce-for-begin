import { useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaShippingFast,
  FaCheck,
  FaRegClock,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";

function ProductDetail({ product, addToCart, isInFavorites, toggleFavorite }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Ürün resimleri
  const images = product.images || [product.thumbnail || "/placeholder.svg"];

  // İndirimli fiyat hesaplama
  const discountedPrice = product.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : null;

  const handleAddToCart = () => {
    addToCart({ ...product, adet: quantity });
    toast.success(`${quantity} adet ${product.title} sepete eklendi`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ürün linki kopyalandı");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Ürün Görselleri */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-xl overflow-hidden border">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 overflow-hidden
                    ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} - görsel ${index + 1}`}
                    className="w-full h-full object-contain bg-white p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {product.category.toUpperCase()}
              </span>
              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full">
                {product.brand}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(product.rating)
                        ? ""
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>
          </div>

          {/* Fiyat ve Stok */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {discountedPrice.toFixed(2)} ₺
                  </span>
                  <span className="text-xl line-through text-gray-500 dark:text-gray-400">
                    {product.price.toFixed(2)} ₺
                  </span>
                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm font-bold px-2 py-1 rounded">
                    %{Math.round(product.discountPercentage)} İndirim
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {product.price.toFixed(2)} ₺
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <FaCheck />
                  <span className="font-medium">
                    Stokta {product.stock} adet var
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <FaRegClock />
                  <span className="font-medium">Tükendi</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <FaShippingFast />
              <span>Bugün sipariş verirseniz 2 gün içinde kargoya verilir</span>
            </div>
          </div>

          {/* Adet ve Sepete Ekle */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t dark:border-gray-700">
            <div className="flex items-center border rounded-lg overflow-hidden w-36">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.stock,
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  )
                }
                className="w-16 h-10 text-center border-x dark:border-gray-700 bg-transparent"
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <div className="flex gap-2 flex-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium
                  ${
                    product.stock > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
              >
                <FaShoppingCart />
                <span>Sepete Ekle</span>
              </button>

              <button
                onClick={toggleFavorite}
                className={`w-12 h-12 flex items-center justify-center rounded-lg
                  ${
                    isInFavorites
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  }`}
              >
                <FaHeart />
              </button>

              <button
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Detayları Sekmeleri */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b dark:border-gray-700 mb-4">
          <TabsTrigger value="details">Ürün Detayları</TabsTrigger>
          <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
          <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,
              eget ultricies nisl nisl eget nisl.
            </p>
            <ul>
              <li>Yüksek kaliteli malzemeler</li>
              <li>Uzun ömürlü kullanım</li>
              <li>Kolay temizlenebilir</li>
              <li>Ergonomik tasarım</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="specs">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Ürün Özellikleri</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Marka</span>
                      <span>{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Kategori</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Stok Durumu</span>
                      <span>
                        {product.stock > 0
                          ? `${product.stock} adet`
                          : "Tükendi"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Garanti</span>
                      <span>24 Ay</span>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Teslimat</span>
                      <span>2-3 İş Günü</span>
                    </div>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                      <span className="font-medium">Ürün Kodu</span>
                      <span>PRD-{product.id}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Ölçüler ve Ağırlık</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b dark:border-gray-700">
                    <span className="font-medium">Ağırlık</span>
                    <span>0.5 kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b dark:border-gray-700">
                    <span className="font-medium">Boyutlar</span>
                    <span>10 x 15 x 5 cm</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-500">
                  {product.rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  5 üzerinden
                </div>
                <div className="flex text-yellow-400 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(product.rating)
                          ? ""
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-2">{star}</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Kullanıcı {i + 1}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <FaStar
                            key={j}
                            className={
                              j < 4 ? "" : "text-gray-300 dark:text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </span>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam auctor, nisl eget ultricies tincidunt, nisl nisl
                    aliquam nisl, eget ultricies nisl nisl eget nisl.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProductDetail;
