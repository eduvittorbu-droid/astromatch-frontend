import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.astromatch.app.br';

export default function CompleteProfile() {
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthCity: '',
    birthState: '',
    birthCountry: 'Brasil',
    userGender: '',
    ageMin: 18,
    ageMax: 80,
    seekGender: 'both',
    goals: []
  });
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoals = (goal) => {
    const newGoals = form.goals.includes(goal)
      ? form.goals.filter(g => g !== goal)
      : [...form.goals, goal];
    setForm({ ...form, goals: newGoals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      // 1. Completa o perfil (dados de nascimento)
      await axios.post(`${API_URL}/auth/complete-profile`, {
        userId,
        name: form.name,
        birthDate: form.birthDate,
        birthTime: form.birthTime,
        birthCity: form.birthCity,
        birthState: form.birthState,
        birthCountry: form.birthCountry
      }, { headers: { Authorization: `Bearer ${token}` } });

      // 2. Salva preferências de busca
      await axios.post(`${API_URL}/profile/search-prefs`, {
        user_gender: form.userGender,
        age_min: form.ageMin,
        age_max: form.ageMax,
        seek_gender: form.seekGender,
        goals: form.goals
      }, { headers: { Authorization: `Bearer ${token}` } });

      // 3. Upload das fotos (até 3)
      for (let file of photos) {
        const fd = new FormData();
        fd.append('photo', file);
        await axios.post(`${API_URL}/profile/upload-photo`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }

      alert('Perfil completo! Redirecionando...');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao completar perfil. Verifique os dados.');
    }
  };

  return (
    <div className="container">
      <h2>Complete seu perfil</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome completo" onChange={handleChange} required />
        <input type="date" name="birthDate" onChange={handleChange} required />
        <input type="time" name="birthTime" defaultValue="12:00" onChange={handleChange} />
        <input name="birthCity" placeholder="Cidade" onChange={handleChange} required />
        <input name="birthState" placeholder="Estado (ex: SP)" onChange={handleChange} required />
        <input name="birthCountry" placeholder="País" defaultValue="Brasil" onChange={handleChange} required />
        
        <select name="userGender" onChange={handleChange} required>
          <option value="">Seu gênero</option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="non-binary">Não binário</option>
        </select>
        
        <input type="number" name="ageMin" placeholder="Idade mínima" value={form.ageMin} onChange={handleChange} />
        <input type="number" name="ageMax" placeholder="Idade máxima" value={form.ageMax} onChange={handleChange} />
        
        <select name="seekGender" onChange={handleChange}>
          <option value="male">Homens</option>
          <option value="female">Mulheres</option>
          <option value="both">Ambos</option>
        </select>
        
        <div>
          <label><input type="checkbox" onChange={() => handleGoals('love')} /> Namoro</label>
          <label><input type="checkbox" onChange={() => handleGoals('friendship')} /> Amizade</label>
          <label><input type="checkbox" onChange={() => handleGoals('adventure')} /> Aventura</label>
        </div>
        
        <input type="file" multiple accept="image/*" onChange={e => setPhotos([...e.target.files])} />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
