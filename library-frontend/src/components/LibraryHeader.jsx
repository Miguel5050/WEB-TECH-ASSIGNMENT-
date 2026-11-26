import { Link } from "react-router-dom";

function LibraryHeader({ isAuthenticated }) {
    return (
      <>
        <h1>LIBRARY MANAGEMENT SYSTEM</h1>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/main" style={{ paddingRight: "10px" }}>DASHBOARD</Link>
              <Link to="/office" style={{ paddingRight: "10px" }}>OFFICE</Link>
              <Link to="/" style={{ paddingRight: "10px" }}>LOGIN</Link>
            </>
          ) : (
            <Link to="/" style={{ paddingRight: "10px" }}>LOGIN</Link>
          )}
        </nav>
      </>
    );
}
export default LibraryHeader