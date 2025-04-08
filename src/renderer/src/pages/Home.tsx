import HeroBanner from "@/components/media/HeroBanner";
import { MEDIA_MOCK } from "@/constants/mocks";

export default function Home() {
  return <div>
    <HeroBanner media={MEDIA_MOCK} />
  </div>
}
