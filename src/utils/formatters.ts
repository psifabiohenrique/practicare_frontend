export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function formatTime(timeString: string): string {
  if (!timeString) return "";
  // Split by ':' and take the first two parts (HH:MM)
  // Handles cases like "02:05:41.365Z" or "02:05:41"
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeString;
}

const weekdayTranslations: Record<string, string> = {
  Monday: "Segunda-feira",
  Tuesday: "Terça-feira",
  Wednesday: "Quarta-feira",
  Thursday: "Quinta-feira",
  Friday: "Sexta-feira",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export function translateWeekday(weekday: string): string {
  return weekdayTranslations[weekday] || weekday;
}
const genderTranslations: Record<string, string> = {
  Male: "Masculino",
  Female: "Feminino",
  Other: "Outro",
};

export function translateGender(gender: string): string {
  return genderTranslations[gender] || gender;
}
