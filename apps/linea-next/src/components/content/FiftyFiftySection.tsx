"use client";

import Image from "next/image";
import Link from "next/link";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link href="/category/earrings" className="block">
            <div className="relative w-full aspect-square mb-3 overflow-hidden">
              <Image
                src="/images/earrings-collection.jpg"
                alt="Earrings collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Organic Forms</h3>
            <p className="text-sm font-light text-foreground">
              Nature-inspired pieces with fluid, sculptural details
            </p>
          </div>
        </div>

        <div>
          <Link href="/category/bracelets" className="block">
            <div className="relative w-full aspect-square mb-3 overflow-hidden">
              <Image
                src="/images/link-bracelet.jpg"
                alt="Chain link bracelet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
          <div className="">
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
