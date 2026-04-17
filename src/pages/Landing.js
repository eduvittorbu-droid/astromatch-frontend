import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <h1>✨ AstroMatch ✨</h1>
      <p>Encontre seu match perfeito com a ajuda das estrelas</p>
      <Link to="/register"><button>Cadastre-se</button></Link>
      <Link to="/login"><button>Login</button></Link>
    </div>
  );
}
