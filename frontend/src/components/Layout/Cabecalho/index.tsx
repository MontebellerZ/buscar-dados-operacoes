import { Button } from "react-bootstrap";
import styles from "./styles.module.scss";
import { IoMenu } from "react-icons/io5";

function Cabecalho() {
  return (
    <section className={styles.header}>
      <div>
        <Button variant="outline-secondary">
          <IoMenu />
        </Button>
      </div>

      <div>
        <h1>Gerenciar Dados Operações</h1>
      </div>

      <div></div>
    </section>
  );
}

export default Cabecalho;
