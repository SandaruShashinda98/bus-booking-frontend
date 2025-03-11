import { useParams } from "react-router-dom";

const SingleProfilePage = () => {
  const params = useParams<{ profileId: string }>();
  return <div>{params.profileId}</div>;
};

export default SingleProfilePage;
