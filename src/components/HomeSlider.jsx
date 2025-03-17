import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const sliderData = [
  {
    id: 1,
    title: "Yeni Sezon Ürünleri",
    description: "En yeni teknoloji ürünlerini keşfedin",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    buttonText: "Alışverişe Başla",
    link: "/category/smartphones",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "Büyük İndirim",
    description: "Seçili ürünlerde %50'ye varan indirimler",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    buttonText: "İndirimleri Gör",
    link: "/category/laptops",
    color: "from-red-600 to-yellow-600",
  },
  {
    id: 3,
    title: "Ev Dekorasyon",
    description: "Evinizi güzelleştirecek ürünler",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    buttonText: "Keşfet",
    link: "/category/home-decoration",
    color: "from-green-600 to-teal-600",
  },
];

function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="relative h-[400px] md:h-[500px] mb-12 overflow-hidden rounded-xl">
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r bg-opacity-70 z-10 flex flex-col justify-center px-8 md:px-16 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-md">
              {slide.description}
            </p>
            <button
              onClick={() => navigate(slide.link)}
              className={`bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors w-fit`}
            >
              {slide.buttonText}
            </button>
          </div>
          <img
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-60`}
          ></div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HomeSlider;
