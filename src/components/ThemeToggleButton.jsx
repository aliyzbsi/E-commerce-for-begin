import { useTheme } from "../context/ThemeContext";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? <MdDarkMode size={25} /> : <MdLightMode size={25} />}
    </button>
  );
}

export default ThemeToggleButton;
