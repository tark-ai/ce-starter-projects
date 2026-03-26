import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import SEO from "../components/Seo";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
        noindex
      />
      <Header />

      <main className="pt-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
            <Link to="/" className="text-primary underline hover:text-primary/80">
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
