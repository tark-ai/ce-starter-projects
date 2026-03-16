import { images } from "@ce/ui/lib/images";
import Image from "next/image";

const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <Image
          src={images.heroImage}
          alt="Modern jewelry collection"
          width={2690}
          height={1792}
          className="w-full h-full object-cover"
          sizes="calc(100vw - 48px)"
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
