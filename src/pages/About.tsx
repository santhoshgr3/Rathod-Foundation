import PageHeader from "../components/PageHeader";
import Bio from "../components/Bio";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>Meet Dhanraj Rathod</>}
        subtitle="A grassroots leader from Banjara Hills who measures success in problems solved — not promises made."
      />
      <Bio />
    </>
  );
}
