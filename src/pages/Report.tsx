import PageHeader from "../components/PageHeader";
import ReportForm from "../components/ReportForm";
import { useCMS } from "../contexts/CMSContext";

export default function Report() {
  const { cms: { pages } } = useCMS();
  const p = pages.report;
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <ReportForm />
    </>
  );
}
