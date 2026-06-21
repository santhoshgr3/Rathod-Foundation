import PageHeader from "../components/PageHeader";
import WorkDone from "../components/WorkDone";

export default function Work() {
  return (
    <>
      <PageHeader
        eyebrow="Work done"
        title={<>Before &amp; after, on the record</>}
        subtitle="Drag the slider on each card to see the change. Every case is dated, located in Banjara Hills, and resolved on the ground."
      />
      <WorkDone withHead={false} />
    </>
  );
}
