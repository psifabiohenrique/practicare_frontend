import { useState } from "react";
import { createPatient } from "../../api/patient.service";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import SelectField from "../SelectField/SelectField";
import Button from "../Button/Button";
import { MessageCard } from "../MessageCard/MessageCard";
import { validatePatient } from "./patientValidation";
import type { PatientPayload } from "../../types/patient";

export function PatientForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [weekday, setWeekday] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [messages, setMessages] = useState<string[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: PatientPayload = {
      patient_schema: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        birth_date: birthDate,
      },
      treatment_schema: {
        user_uuid: "", // This might be handled by backend or extracted from auth context
        patient_id: "", // This might be handled by backend
        weekday,
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
      await createPatient(payload);
      setMessages(["Paciente cadastrado com sucesso!"]);
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setBirthDate("");
      setWeekday("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      setMessages(["Erro ao cadastrar paciente"]);
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

  return (
    <Form onSubmit={handleSubmit}>
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

      <h3>Dados do Tratamento</h3>
      <SelectField
        label="Dia da Semana"
        value={weekday}
        onChange={(e) => setWeekday(e.target.value)}
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

      <Button type="submit">Cadastrar Paciente</Button>
    </Form>
  );
}
