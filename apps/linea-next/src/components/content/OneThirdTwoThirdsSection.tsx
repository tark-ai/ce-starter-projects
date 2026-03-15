"use client";

import Image from "next/image";
import Link from "next/link";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link href="/category/rings" className="block">
            <div className="relative w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                src="/images/organic-earring.jpg"
                alt="Artisan crafted jewelry"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Artisan Craft</h3>
            <p className="text-sm font-light text-foreground">
              Handcrafted pieces with meticulous attention to detail
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link href="/category/necklaces" className="block">
            <div className="relative w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                src="/images/circular-collection.jpg"
                alt="Circular jewelry collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 67vw"
              />
            </div>
          </Link>
          <div className="">
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
