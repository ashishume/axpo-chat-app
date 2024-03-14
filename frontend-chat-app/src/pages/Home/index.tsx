import useLocalStorage from "../../shared/Hooks/useLocalStorage";

const Home = () => {
  const { removeStoredValue } = useLocalStorage("auth");
  const logOut = () => {
    removeStoredValue("auth");
  };
  return (
    <div>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default Home;
