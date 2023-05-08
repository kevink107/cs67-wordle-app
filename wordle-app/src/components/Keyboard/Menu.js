import "./menu.css";

export default function Menu({ menuOpen, setMenuOpen }) {
  return (
    <div className={"menu " + (menuOpen ? "active" : "")}>
      <ul>
        <li onClick={() => setMenuOpen(false)}>
          <a href="#">Hello</a>
        </li>
      </ul>
    </div>
  );
}