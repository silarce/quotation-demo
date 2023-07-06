import style from './other.module.scss';

export default function Status({ text, className = '' }: { text: string; className?: string }) {
  className = `${style.status} ${className}`;

  return <span className={className}>{text}</span>;
}
