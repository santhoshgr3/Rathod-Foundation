import PageHeader from "../components/PageHeader";
import WorkDone from "../components/WorkDone";
import { useCMS } from "../contexts/CMSContext";

export default function Work() {
  const { cms: { pages } } = useCMS();
  const p = pages.work;
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <WorkDone withHead={false} />
    </>
  );
}
