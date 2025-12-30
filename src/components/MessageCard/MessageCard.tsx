type MessageCardProps = {
  title?: string;
  message: string;
};

export function MessageCard({ title, message }: MessageCardProps) {
  return (
    <div>
      {title && <h4>{title}</h4>}
      <p>{message}</p>
    </div>
  );
}
