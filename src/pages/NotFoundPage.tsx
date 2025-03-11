import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <div>404 Not found</div>
      <Link to={"/home"}>go to home</Link>
    </>
  );
};

export default NotFoundPage;
