import { useEffect, useState } from "react";
import { PatientTable } from "../../../components/PatientTable/PatientTable";
import { listPatients } from "../../../api/patient.service";
import type {
  Patient,
  PatientListParams,
  Gender,
  Weekdays,
} from "../../../types/patient";
import TextField from "../../../components/TextField/TextField";
import SelectField from "../../../components/SelectField/SelectField";
import Button from "../../../components/Button/Button";

export function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<PatientListParams>({
    skip: 0,
    limit: 25,
    search: "",
    gender: undefined,
    weekday: undefined,
    order_by: "name",
    order_dir: "asc",
  });

  async function fetchPatients() {
    setIsLoading(true);
    try {
      const data = await listPatients(params);
      setPatients(data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, [params]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, search: e.target.value, skip: 0 });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({
      ...params,
      gender: (e.target.value as Gender) || undefined,
      skip: 0,
    });
  };

  const handleWeekdayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({
      ...params,
      weekday: (e.target.value as Weekdays) || undefined,
      skip: 0,
    });
  };

  const handlePageChange = (newSkip: number) => {
    setParams({ ...params, skip: newSkip });
  };

  const genderOptions = [
    { label: "Masculino", value: "Male" },
    { label: "Feminino", value: "Female" },
    { label: "Outro", value: "Other" },
  ];

  const weekdayOptions = [
    { label: "Segunda-feira", value: "Monday" },
    { label: "Terça-feira", value: "Tuesday" },
    { label: "Quarta-feira", value: "Wednesday" },
    { label: "Quinta-feira", value: "Thursday" },
    { label: "Sexta-feira", value: "Friday" },
    { label: "Sábado", value: "Saturday" },
    { label: "Domingo", value: "Sunday" },
  ];

  return (
    <div>
      <h1>Lista de Pacientes</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "flex-end",
        }}
      >
        <TextField
          label="Buscar por nome"
          value={params.search}
          onChange={handleSearchChange}
          placeholder="Digite o nome..."
        />
        <SelectField
          label="Gênero"
          value={params.gender || ""}
          onChange={handleGenderChange}
          options={genderOptions}
        />
        <SelectField
          label="Dia da Semana"
          value={params.weekday || ""}
          onChange={handleWeekdayChange}
          options={weekdayOptions}
        />
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <PatientTable data={patients} />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Button
              onClick={() =>
                handlePageChange(Math.max(0, (params.skip || 0) - 25))
              }
              disabled={(params.skip || 0) === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={() => handlePageChange((params.skip || 0) + 25)}
              disabled={patients.length < 25}
            >
              Próxima
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
