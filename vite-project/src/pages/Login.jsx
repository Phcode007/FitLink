import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Acesse sua conta</h2>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="seu@email.com"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.primaryButton}>
                        Entrar
                    </button>
                </form>

                <div className={styles.links}>
                    <Link to="/recuperar-senha" className={styles.link}>
                        Esqueceu sua senha?
                    </Link>
                    <p className={styles.signupText}>
                        Não tem conta? <Link to="/cadastro" className={styles.signupLink}>Crie agora</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;