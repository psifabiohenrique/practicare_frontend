import { useEffect, useState } from "react";
import { PatientList } from "../../../components/PatientList/PatientList";
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
import styles from "./PatientListPage.module.css";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetchPatients();
  }
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
  }, []);

  const handleNameOrder = () => {
    const nextDir = params.order_dir === "asc" ? "desc" : "asc";
    setParams({
      ...params,
      order_by: "name",
      order_dir: nextDir,
      skip: 0,
    });
    // We need to fetch with the updated params immediately
    fetchPatientsWithParams({
      ...params,
      order_by: "name",
      order_dir: nextDir,
      skip: 0,
    });
  };

  const fetchPatientsWithParams = async (p: PatientListParams) => {
    setIsLoading(true);
    try {
      const data = await listPatients(p);
      setPatients(data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchPatientsWithParams({ ...params, skip: newSkip });
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
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Lista de Pacientes</h1>

      <form onSubmit={handleSubmit} className={styles.filterForm}>
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
        <Button type="submit">Buscar</Button>
      </form>

      {isLoading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <>
          <PatientList
            data={patients}
            onNameClick={handleNameOrder}
            orderDir={params.order_dir}
          />

          <div className={styles.pagination}>
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
