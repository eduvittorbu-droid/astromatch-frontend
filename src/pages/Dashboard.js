import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.astromatch.app.br';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/search/candidates`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const handleLike = async (targetId) => {
    const res = await axios.post(`${API_URL}/like/like/${targetId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (res.data.match) {
      alert(`Match! Chat disponível.`);
      window.location.href = `/chat/${res.data.matchId}`;
    } else {
      alert('Like enviado!');
      setCandidates(candidates.filter(c => c.id !== targetId));
    }
  };

  return (
    <div>
      <h2>Potenciais matches</h2>
      {candidates.map(c => (
        <div key={c.id}>
          <img src={c.photo || '/default.png'} width="80" alt={c.name} />
          <p>{c.name} - Compatibilidade: {c.synastry?.totalScore || 0}%</p>
          <button onClick={() => handleLike(c.id)}>❤️ Like</button>
        </div>
      ))}
    </div>
  );
}
