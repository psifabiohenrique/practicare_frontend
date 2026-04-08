import { useState, useEffect } from "react";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import PhoneInput from "../PhoneInput/PhoneInput";
import SelectField from "../SelectField/SelectField";
import Button from "../Button/Button";
import { showSuccess, showError, showWarning } from "../../utils/swal";
import { validatePatient } from "./patientValidation";
import type { PatientPayload, Gender, Weekdays } from "../../types/patient";
import {
  createPatient,
  getPatient,
  updatePatient,
} from "../../api/patient.service";
import styles from "./PatientForm.module.css";

interface PatientFormProps {
  uuid?: string;
  onSuccess?: () => void;
}

export function PatientForm({ uuid, onSuccess }: PatientFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender>("Other");
  const [weekday, setWeekday] = useState<Weekdays>("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userUUID, setUserUUID] = useState<string>("");

  const [submitButtonText, setSubmitButtonText] = useState<string>("Salvar");

  async function fetchPatientInitialData(uuid: string) {
    const patient = await getPatient(uuid);
    setFirstName(patient.patient.first_name);
    setLastName(patient.patient.last_name);
    setEmail(patient.patient.email);
    setPhone(patient.patient.phone);
    setBirthDate(patient.patient.birth_date);
    setGender(patient.patient.gender);
    setWeekday(patient.weekday);
    setStartTime(patient.start_time);
    setEndTime(patient.end_time);
    setUserUUID(patient.user_uuid);
  }
  useEffect(() => {
    async function loadData(uuid: string) {
      await fetchPatientInitialData(uuid);
      setSubmitButtonText("Atualizar");
    }
    if (uuid) {
      loadData(uuid);
    }
  }, [uuid]);

  const handleBirthDatePaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pastedText = event.clipboardData.getData("text").trim();

    // DD/MM/YYYY or DD-MM-YYYY
    const brDateRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
    // YYYY-MM-DD or YYYY/MM/DD
    const isoDateRegex = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;

    let formattedDate = "";

    const brMatch = pastedText.match(brDateRegex);
    if (brMatch) {
      const [, day, month, year] = brMatch;
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else {
      const isoMatch = pastedText.match(isoDateRegex);
      if (isoMatch) {
        const [, year, month, day] = isoMatch;
        formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    if (formattedDate) {
      event.preventDefault();
      setBirthDate(formattedDate);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: PatientPayload = {
      patient_schema: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        birth_date: birthDate,
        gender,
      },
      treatment_schema: {
        user_uuid: userUUID || "",
        patient_uuid: uuid || "",
        weekday: weekday,
        start_time: startTime,
        end_time: endTime,
      },
    };

    const errors = validatePatient(payload);
    if (Object.keys(errors).length > 0) {
      showWarning("Dados inválidos", Object.values(errors).join("\n"));
      return;
    }

    try {
      if (uuid) {
        await updatePatient(uuid, payload);
      } else {
        await createPatient(payload);
      }
      
      await showSuccess("Sucesso", "Operação realizada com sucesso!");

      if (!uuid) {
        // Clear form only on create
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setBirthDate("");
        setGender("Other");
        setWeekday("Monday");
        setStartTime("");
        setEndTime("");
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      showError("Erro", "Erro ao processar a solicitação");
    }
  }

  const weekdayOptions = [
    { label: "Segunda-feira", value: "Monday" },
    { label: "Terça-feira", value: "Tuesday" },
    { label: "Quarta-feira", value: "Wednesday" },
    { label: "Quinta-feira", value: "Thursday" },
    { label: "Sexta-feira", value: "Friday" },
    { label: "Sábado", value: "Saturday" },
    { label: "Domingo", value: "Sunday" },
  ];

  const genderOptions = [
    { label: "Masculino", value: "Male" },
    { label: "Feminino", value: "Female" },
    { label: "Outro", value: "Other" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div style={{minWidth: "300px"}}>
          <h3>Dados Pessoais</h3>
          <TextField
            label="Nome"
            placeholder="Primeiro nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Sobrenome"
            placeholder="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="E-mail"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PhoneInput
            label="Telefone"
            placeholder="Telefone"
            value={phone}
            onChange={(value) => setPhone(value || "")}
          />
          <TextField
            label="Data de Nascimento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            onPaste={handleBirthDatePaste}
          />
          <SelectField
            label="Gênero"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            options={genderOptions}
            required
          />
        </div>
        <div style={{minWidth: "300px"}}>
          <h3>Dados do Tratamento</h3>
          <SelectField
            label="Dia da Semana"
            value={weekday}
            onChange={(e) => setWeekday(e.target.value as Weekdays)}
            options={weekdayOptions}
            required
          />
          <TextField
            label="Horário de Início"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <TextField
            label="Horário de Término"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit">{submitButtonText}</Button>
    </Form>
  );
}
