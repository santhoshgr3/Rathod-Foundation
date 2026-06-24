import PageHeader from "../components/PageHeader";
import Bio from "../components/Bio";
import { useCMS } from "../contexts/CMSContext";

export default function About() {
  const { cms: { pages } } = useCMS();
  const p = pages.about;
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <Bio />
    </>
  );
}
