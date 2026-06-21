import PageHeader from "../components/PageHeader";
import WardImpact from "../components/WardImpact";
import BanjaraMap from "../components/BanjaraMap";

export default function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact"
        title={<>The footprint across Banjara Hills</>}
        subtitle="Where the issues come from, how many are resolved, and exactly where on the map the work is happening."
      />
      <WardImpact />
      <BanjaraMap />
    </>
  );
}
