import type { RegisterPayload } from "../../types/user";

export function validateRegister(data: RegisterPayload) {
  const errors: Partial<Record<keyof RegisterPayload, string>> = {};

  if (!data.name) errors.name = "Nome é obrigatório.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "E-mail inválido.";

  if (data.password.length < 8)
    errors.password = "Senha deve ter no mínimo 8 caracteres.";

  if (
    !/[a-z]/.test(data.password) ||
    !/[A-Z]/.test(data.password) ||
    !/[0-9]/.test(data.password) ||
    !/[^a-zA-Z0-9]/.test(data.password)
  )
    errors.password =
      "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.";

  if (data.password !== data.password_confirmation)
    errors.password_confirmation = "As senhas não conferem.";

  return errors;
}
