import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.astromatch.app.br';

export default function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const cpf = prompt('Digite seu CPF (apenas números) para teste gratuito:');
    axios.post(`${API_URL}/payment/create-checkout`, { userId, cpf })
      .then(res => window.location.href = res.data.url)
      .catch(err => {
        console.error(err);
        alert('Erro ao iniciar pagamento. Tente novamente.');
        navigate('/register');
      });
  }, [navigate]);

  return <div>Redirecionando para pagamento...</div>;
}
