import "./Column.css";
export default function Column({ title, children }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}
