import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const NotFound = () => (
  <Layout>
    <div className="soja-container py-32 tablet:py-48">
      <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
        This page has gone quiet
      </h1>
      <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
        The page you were looking for isn't here. Return to the collection.
      </p>
      <Link
        to="/all-products"
        className="mt-10 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
      >
        Shop the collection
        <span aria-hidden className="h-1.5 w-1.5 bg-current" />
      </Link>
    </div>
  </Layout>
);

export default NotFound;
