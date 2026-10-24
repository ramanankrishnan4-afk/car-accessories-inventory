
export default function Topbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-profile">
        <div className="profile-avatar">A</div>

        <div className="profile-details">
          <strong>Administrator</strong>
          <span>Inventory Manager</span>
        </div>
      </div>
    </header>
  );
}
