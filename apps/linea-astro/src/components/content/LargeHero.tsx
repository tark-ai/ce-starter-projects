import { IMAGEKIT_ENDPOINT, imagePaths } from "@ce/ui/lib/images";
import { Image } from "@imagekit/react";

const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <Image
          urlEndpoint={IMAGEKIT_ENDPOINT}
          src={imagePaths.heroImage}
          alt="Modern jewelry collection"
          width={2690}
          height={1792}
          sizes="calc(100vw - 48px)"
          transformation={[{ quality: 80 }]}
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
