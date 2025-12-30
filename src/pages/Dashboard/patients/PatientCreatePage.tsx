import { PatientForm } from "../../../components/PatientForm/PatientForm";
import { createPatient } from "../../../api/patient.service";

export function PatientCreatePage() {
  return (
    <div>
      <h1>Criar Paciente</h1>
      <PatientForm
        onSubmit={createPatient}
        submitButtonText="Cadastrar Paciente"
        successMessage="Paciente cadastrado com sucesso!"
      />
    </div>
  );
}
