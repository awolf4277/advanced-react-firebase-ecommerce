import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <section>
    <h2>404 - Page Not Found</h2>
    <p>
      Go back to the <Link to="/">home page</Link>.
    </p>
  </section>
);

export default NotFound;
