import { Link } from "react-router-dom";

function HelloWorldPage() {
  return (
    <>
      <h1>Hello World!!!</h1>
      <p>
        Puedes volver a la página de inicio haciendo clic aquí: {' '}
        <Link to="/">Goodbye World !!!</Link>.
      </p>
    </>
  );
}

export default HelloWorldPage;
