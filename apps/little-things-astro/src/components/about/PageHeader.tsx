import { PageHeader as SharedPageHeader } from "@ce/little-things-shared/about";
import type { LittleThingsRoute } from "@ce/little-things-shared/lib/routing";
import { LittleThingsLink } from "@/lib/little-things-routing";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaRoute?: LittleThingsRoute;
}

const PageHeader = ({ title, subtitle, ctaLabel, ctaRoute }: PageHeaderProps) => {
  return (
    <SharedPageHeader
      title={title}
      subtitle={subtitle}
      ctaLabel={ctaLabel}
      ctaRoute={ctaRoute}
      LinkComponent={ctaLabel && ctaRoute ? LittleThingsLink : undefined}
    />
  );
};

export default PageHeader;
