import PageHeader from "../components/PageHeader";
import ReportForm from "../components/ReportForm";

export default function Report() {
  return (
    <>
      <PageHeader
        eyebrow="Report an issue"
        title={<>Report an issue</>}
        subtitle="Tell us what's wrong and get a live tracking number in seconds. We respond within 24 hours."
      />
      <ReportForm />
    </>
  );
}
