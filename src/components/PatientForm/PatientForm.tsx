import { useState, useEffect } from "react";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import SelectField from "../SelectField/SelectField";
import Button from "../Button/Button";
import { MessageCard } from "../MessageCard/MessageCard";
import { validatePatient } from "./patientValidation";
import type {
  Patient,
  PatientPayload,
  Gender,
  Weekdays,
} from "../../types/patient";
import styles from "./PatientForm.module.css";

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (payload: PatientPayload) => Promise<any>;
  submitButtonText?: string;
  successMessage?: string;
}

export function PatientForm({
  initialData,
  onSubmit,
  submitButtonText = "Salvar",
  successMessage = "Operação realizada com sucesso!",
}: PatientFormProps) {
  const [firstName, setFirstName] = useState(
    initialData?.patient.first_name || ""
  );
  const [lastName, setLastName] = useState(
    initialData?.patient.last_name || ""
  );
  const [email, setEmail] = useState(initialData?.patient.email || "");
  const [phone, setPhone] = useState(initialData?.patient.phone || "");
  const [birthDate, setBirthDate] = useState(
    initialData?.patient.birth_date || ""
  );
  const [gender, setGender] = useState<Gender>(
    initialData?.patient.gender || "Other"
  );

  const [weekday, setWeekday] = useState<Weekdays>(
    initialData?.weekday || "Monday"
  );
  const [startTime, setStartTime] = useState(initialData?.start_time || "");
  const [endTime, setEndTime] = useState(initialData?.end_time || "");

  const [messages, setMessages] = useState<string[] | null>(null);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.patient.first_name);
      setLastName(initialData.patient.last_name);
      setEmail(initialData.patient.email);
      setPhone(initialData.patient.phone);
      setBirthDate(initialData.patient.birth_date);
      setGender(initialData.patient.gender);
      setWeekday(initialData.weekday);
      setStartTime(initialData.start_time);
      setEndTime(initialData.end_time);
    }
  }, [initialData]);

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
        user_uuid: initialData?.user_uuid || "",
        patient_uuid: initialData?.patient_uuid || "",
        weekday: weekday,
        start_time: startTime,
        end_time: endTime,
      },
    };

    const errors = validatePatient(payload);
    if (Object.keys(errors).length > 0) {
      setMessages(Object.values(errors));
      return;
    }

    try {
      await onSubmit(payload);
      setMessages([successMessage]);
      if (!initialData) {
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
    } catch (error) {
      setMessages(["Erro ao processar a solicitação"]);
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
    <Form onSubmit={handleSubmit} grid={true}>
      {messages &&
        messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}

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
        required
      />
      <TextField
        label="Telefone"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <TextField
        label="Data de Nascimento"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
      />
      <SelectField
        label="Gênero"
        value={gender}
        onChange={(e) => setGender(e.target.value as Gender)}
        options={genderOptions}
        required
      />

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

      <Button type="submit">{submitButtonText}</Button>
    </Form>
  );
}
