import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.astromatch.app.br';

export default function Chat() {
  const { matchId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const s = io(API_URL, { auth: { token } });
    setSocket(s);
    s.emit('join-match', { matchId });
    s.on('new-message', (msg) => setMessages(prev => [...prev, msg]));
    return () => s.disconnect();
  }, [matchId, token]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('send-message', { matchId, message: input });
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map(m => <div key={m.id}><strong>{m.sender_id === localStorage.getItem('userId') ? 'Você' : 'Match'}:</strong> {m.message}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
