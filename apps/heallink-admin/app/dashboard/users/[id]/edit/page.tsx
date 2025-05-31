import PatientEditContainer from "@/app/features/user-management/containers/PatientEditContainer";

export default function EditUserPage({ params }: { params: { id: string } }) {
  return <PatientEditContainer patientId={params.id} />;
}
