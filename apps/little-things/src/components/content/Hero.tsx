import { Hero as SharedHero } from "@ce/little-things-shared/content";
import { LittleThingsLink } from "@/lib/little-things-routing";

const Hero = () => {
  return <SharedHero LinkComponent={LittleThingsLink} />;
};

export default Hero;
