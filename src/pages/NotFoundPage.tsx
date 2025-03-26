import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <div>404 Not found</div>
      <Link to={"/search"}>go to main page</Link>
    </>
  );
};

export default NotFoundPage;
