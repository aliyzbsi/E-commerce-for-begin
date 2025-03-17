import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function FeaturedCategories() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Kategori verileri
  const categories = [
    {
      id: 1,
      name: "Elektronik",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop",
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 2,
      name: "Giyim",
      image:
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop",
      color: "from-pink-500 to-red-500",
    },
    {
      id: 3,
      name: "Ev & Yaşam",
      image:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop",
      color: "from-green-500 to-teal-500",
    },
    {
      id: 4,
      name: "Spor",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Popüler Kategoriler</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative h-48 rounded-xl overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate(`/?category=${category.name}`)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}
            ></div>
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedCategories;
