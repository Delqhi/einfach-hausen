import { Chevron } from "./icons";

export default function ActionCard({
  icon,
  title,
  subtitle,
  href,
  variant = "plain",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  variant?: "tint" | "bordered" | "plain";
}) {
  return (
    <a href={href} className={`action-card ${variant !== "plain" ? variant : ""}`}>
      <div className="action-icon">{icon}</div>
      <div className="action-text">
        <span className="action-title">{title}</span>
        <span className="action-sub">{subtitle}</span>
      </div>
      <Chevron />
    </a>
  );
}
