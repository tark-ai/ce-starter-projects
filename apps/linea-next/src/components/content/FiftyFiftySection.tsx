"use client";

import { images } from "@ce/ui/lib/images";
import Image from "next/image";
import Link from "next/link";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link href="/category/earrings" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                src={images.earringsCollection}
                alt="Earrings collection"
                width={1788}
                height={1792}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
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
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                src={images.linkBracelet}
                alt="Chain link bracelet"
                width={1742}
                height={1744}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
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
