import Swal from "sweetalert2";

// Get CSS variable values for styling
const getVariableValue = (varName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

const commonOptions = {
  confirmButtonColor: getVariableValue("--color-primary") || "#2563eb",
  cancelButtonColor: getVariableValue("--color-text-secondary") || "#6b7280",
  background: getVariableValue("--colot-bg-surface_without_alpha") || "#d5daee",
  color: getVariableValue("--color-text-primary") || "#111827",
  borderRadius: getVariableValue("--radius-lg") || "12px",
};

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: "success",
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: "error",
    title,
    text,
  });
};

export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: "warning",
    title,
    text,
  });
};

export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: "info",
    title,
    text,
  });
};

export const showConfirm = async (title: string, text?: string, confirmText = "Confirmar", cancelText = "Cancelar") => {
  const result = await Swal.fire({
    ...commonOptions,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showToast = (title: string, icon: "success" | "error" | "warning" | "info" = "success") => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    background: commonOptions.background,
    color: commonOptions.color,
  });

  return Toast.fire({
    icon,
    title,
  });
};
