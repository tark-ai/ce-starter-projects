import { IMAGEKIT_ENDPOINT, imagePaths } from "@ce/ui/lib/images";
import { Image } from "@imagekit/react";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <a href="/category/rings" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                urlEndpoint={IMAGEKIT_ENDPOINT}
                src={imagePaths.organicEarring}
                alt="Artisan crafted jewelry"
                width={1590}
                height={1592}
                sizes="(max-width: 1024px) calc(100vw - 48px), calc(33vw - 40px)"
                transformation={[{ quality: 80 }]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Artisan Craft</h3>
            <p className="text-sm font-light text-foreground">
              Handcrafted pieces with meticulous attention to detail
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <a href="/category/necklaces" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                urlEndpoint={IMAGEKIT_ENDPOINT}
                src={imagePaths.circularCollection}
                alt="Circular jewelry collection"
                width={1792}
                height={1792}
                sizes="(max-width: 1024px) calc(100vw - 48px), calc(67vw - 40px)"
                transformation={[{ quality: 80 }]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </a>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Circular Elements</h3>
            <p className="text-sm font-light text-foreground">
              Geometric perfection meets contemporary minimalism
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;
