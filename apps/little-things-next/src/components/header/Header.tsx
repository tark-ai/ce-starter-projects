import type { Category } from "@commercengine/storefront";
import Navigation from "./Navigation";

interface HeaderProps {
  categories?: Category[];
}

const Header = ({ categories }: HeaderProps) => {
  return (
    <header className="w-full sticky top-0 z-50">
      <Navigation serverCategories={categories} />
    </header>
  );
};

export default Header;
