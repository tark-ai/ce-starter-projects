import Image from "next/image";

const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="relative w-full aspect-[16/9] mb-3 overflow-hidden">
        <Image
          src="/images/hero-image.jpg"
          alt="Modern jewelry collection"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="">
        <h2 className="text-sm font-normal text-foreground mb-1">Modern Heritage</h2>
        <p className="text-sm font-light text-foreground">
          Contemporary jewelry crafted with timeless elegance
        </p>
      </div>
    </section>
  );
};

export default LargeHero;
