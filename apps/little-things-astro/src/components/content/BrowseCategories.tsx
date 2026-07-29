import { BrowseCategories as SharedBrowseCategories } from "@ce/little-things-shared/content";
import { useListSkus } from "@/lib/hooks";
import { LittleThingsLink } from "@/lib/little-things-routing";

const BrowseCategories = () => {
  const { skus } = useListSkus({ limit: 16 });

  const allUrls = skus
    .map((sku) => sku.images?.[0]?.url_standard ?? sku.images?.[0]?.url_thumbnail ?? undefined)
    .filter((url): url is string => Boolean(url));

  // Pick with wrap-around so tiles never go blank.
  const at = (i: number) => (allUrls.length ? allUrls[i % allUrls.length] : undefined);

  // Tiles: [0,1] = the two featured cards, [2,3,4] = the three category cards.
  const imageUrls = [at(8), at(9), at(5), at(6), at(7)].filter((url): url is string =>
    Boolean(url)
  );

  return <SharedBrowseCategories LinkComponent={LittleThingsLink} imageUrls={imageUrls} />;
};

export default BrowseCategories;
