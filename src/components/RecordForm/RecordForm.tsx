import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  createRecord,
  getRecord,
  reuploadAutomatedRecord,
  updateRecord,
} from "../../api/record.service";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import { TextArea } from "../TextArea/TextArea";
import Button from "../Button/Button";
import { MessageCard } from "../MessageCard/MessageCard";
import type { RecordPayload, RecordUpdatePayload } from "../../types/record";
import styles from "./RecordForm.module.css";
import { getPatient } from "../../api/patient.service";

interface RecordFormProps {
  treatmentUuid?: string;
  recordUuid?: string;
  onSuccess: () => void;
}

export function RecordForm({
  treatmentUuid,
  recordUuid,
  onSuccess,
}: RecordFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [messages, setMessages] = useState<string[] | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isUpdate = !!recordUuid;

  useEffect(() => {
    if (recordUuid) {
      async function fetchRecord() {
        try {
          setIsFetching(true);
          const record = await getRecord(recordUuid!);
          setDate(record.date);
          setStartTime(record.start_time.substring(0, 5));
          setEndTime(record.end_time.substring(0, 5));
          setContent(record.content);
        } catch (err) {
          console.error("Error fetching record for form:", err);
          setMessages(["Erro ao carregar dados para edição."]);
        } finally {
          setIsFetching(false);
        }
      }
      fetchRecord();
    } else {
      async function fetchTreatment() {
        try {
          setIsFetching(true);
          const treatment = await getPatient(treatmentUuid!);
          setStartTime(treatment.start_time.substring(0, 5));
          setEndTime(treatment.end_time.substring(0, 5));
        } catch (err) {
          console.error("Error fetching treatment for form:", err);
          setMessages(["Erro ao carregar dados para edição."]);
        } finally {
          setIsFetching(false);
        }
      }
      fetchTreatment();
    }
  }, [recordUuid]);

  const handleReuploadAudio = async () => {
    try {
      if (file && recordUuid) {
        const formData = new FormData();
        formData.append("audio_file", file);
        await reuploadAutomatedRecord(recordUuid, formData);
        setMessages([
          "Áudio enviado com sucesso, aguarde que ele será reprocessado",
        ]);
        setContent("O áudio será reprocessado em background!");
      }
    } catch {
      setMessages(["Falha ao enviar o áudio, tente novamente em breve."]);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const _file = event.target.files?.[0];
    if (_file) {
      setFile(_file);
      setFileName(_file.name);
    }
  };

  const handleOpenFileSistem = () => {
    fileInputRef.current?.click();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(null);
    setIsLoading(true);

    try {
      if (isUpdate && recordUuid) {
        const payload: RecordUpdatePayload = {
          date,
          start_time: startTime,
          end_time: endTime,
          content,
        };
        await updateRecord(recordUuid, payload);
      } else if (treatmentUuid) {
        const payload: RecordPayload = {
          treatment_uuid: treatmentUuid,
          date,
          start_time: startTime,
          end_time: endTime,
          content,
        };
        await createRecord(payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving record:", err);
      setMessages([
        "Erro ao salvar o registro. Verifique os dados e tente novamente.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className={styles.loading}>Carregando...</div>;

  return (
    <Form onSubmit={handleSubmit} grid={false}>
      {messages &&
        messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}

      <div className={styles.row}>
        <TextField
          label="Data"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <TextField
          label="Horário de Início"
          type="time"
          name="start_time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <TextField
          label="Horário de Término"
          type="time"
          name="end_time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <TextArea
        label="Conteúdo / Evolução"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={8}
        placeholder="Descreva a evolução do paciente..."
      />

      <div className={styles.actions}>
        {isUpdate && (
          <div className={styles.reSendButton}>
            <label>Escolha um arquivo de áudio a ser reenviado</label>
            <Button
              type="button"
              onClick={handleOpenFileSistem}
              disabled={isLoading}
            >
              Escolher arquivo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Oculta o input nativo
            />
          </div>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : isUpdate ? "Atualizar" : "Salvar"}
        </Button>
      </div>
      <div className={styles.actions}>
        {fileName && <p>Arquivo selecionado: {fileName}</p>}
        {fileName && (
          <button type="button" onClick={handleReuploadAudio}>
            Enviar
          </button>
        )}
      </div>
    </Form>
  );
}
