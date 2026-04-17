import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.astromatch.app.br';

export default function Register() {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const videoRef = useRef();
  const navigate = useNavigate();

  const captureFace = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    setTimeout(() => {
      // Simula um descritor fixo (para teste, sem face-api.js)
      setFaceDescriptor([0.1, 0.2, 0.3]);
      stream.getTracks().forEach(track => track.stop());
      alert('Rosto capturado (simulado)');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) return alert('Aceite os termos');
    const res = await axios.post(`${API_URL}/auth/register`, {
      cpf, email, password,
      termsAccepted: terms,
      disclaimerAccepted: terms,
      privacyAccepted: terms,
      faceDescriptor: faceDescriptor || [0,0,0]
    });
    localStorage.setItem('userId', res.data.userId);
    navigate('/payment');
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="CPF" value={cpf} onChange={e=>setCpf(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="button" onClick={captureFace}>Capturar rosto</button>
        <video ref={videoRef} width="300" height="200" autoPlay muted style={{display: faceDescriptor ? 'none' : 'block'}} />
        <label><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} /> Aceito Termos, Disclaimer e LGPD</label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
