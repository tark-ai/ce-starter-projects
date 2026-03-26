import { IMAGEKIT_ENDPOINT, imagePaths } from "@ce/ui/lib/images";
import { Image } from "@imagekit/react";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <a href="/category/earrings" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                urlEndpoint={IMAGEKIT_ENDPOINT}
                src={imagePaths.earringsCollection}
                alt="Earrings collection"
                width={1788}
                height={1792}
                sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
                transformation={[{ quality: 80 }]}
                loading="eager"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Organic Forms</h3>
            <p className="text-sm font-light text-foreground">
              Nature-inspired pieces with fluid, sculptural details
            </p>
          </div>
        </div>

        <div>
          <a href="/category/bracelets" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                urlEndpoint={IMAGEKIT_ENDPOINT}
                src={imagePaths.linkBracelet}
                alt="Chain link bracelet"
                width={1742}
                height={1744}
                sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
                transformation={[{ quality: 80 }]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Chain Collection</h3>
            <p className="text-sm font-light text-foreground">
              Refined links and connections in precious metals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;
