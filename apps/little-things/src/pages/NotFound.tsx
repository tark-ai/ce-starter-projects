import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold tracking-tight text-foreground">404</h1>
            <p className="mb-6 text-xl font-light text-muted-foreground">
              Well, this page doesn't exist. But plenty of good things do.
            </p>
            <Link
              to="/"
              className="text-sm font-medium text-brand underline hover:opacity-80 transition-opacity"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
