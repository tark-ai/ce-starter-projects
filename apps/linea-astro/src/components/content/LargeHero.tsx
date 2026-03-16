import { images } from "@ce/ui/lib/images";

const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <img
          src={images.heroImage}
          alt="Modern jewelry collection"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      <div>
        <h2 className="text-sm font-normal text-foreground mb-1">Modern Heritage</h2>
        <p className="text-sm font-light text-foreground">
          Contemporary jewelry crafted with timeless elegance
        </p>
      </div>
    </section>
  );
};

export default LargeHero;
