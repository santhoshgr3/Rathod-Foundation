import PageHeader from "../components/PageHeader";
import WardImpact from "../components/WardImpact";
import BanjaraMap from "../components/BanjaraMap";
import { useCMS } from "../contexts/CMSContext";

export default function Impact() {
  const { cms: { pages } } = useCMS();
  const p = pages.impact;
  return (
    <>
      <PageHeader
        eyebrow={p.eyebrow}
        title={p.title}
        subtitle={p.subtitle}
      />
      <WardImpact />
      <BanjaraMap />
    </>
  );
}
