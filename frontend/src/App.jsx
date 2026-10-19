import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

export default function App() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/users/')
      .then(({ data }) => {
        setUsers(data);
        if (data.length) setUserId(String(data[0].id));
      })
      .catch(() => setError('Не удалось загрузить пользователей. Проверьте, запущен ли Django.'))
      .finally(() => setLoadingUsers(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setSending(true);
    try {
      const { data } = await api.post('/notes/', { user_id: Number(userId), text });
      const selectedUser = users.find((user) => user.id === data.user_id);
      const displayName = selectedUser?.username
        ? selectedUser.username.charAt(0).toUpperCase() + selectedUser.username.slice(1)
        : 'пользователя';
      setMessage(`✅ ${data.message} для ${displayName}`);
      setText('');
    } catch (err) {
      const detail = err.response?.data;
      setError(typeof detail?.text?.[0] === 'string' ? detail.text[0] : 'Не удалось отправить заметку. Проверьте данные и попробуйте снова.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <span className="eyebrow">АККАУНТЫ И ЗАМЕТКИ</span>
        <h1>Новая заметка</h1>
        <p className="intro">Выберите пользователя и отправьте ему напоминание.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="user">Пользователь</label>
          <select id="user" value={userId} onChange={(event) => setUserId(event.target.value)} disabled={loadingUsers || !users.length} required>
            {loadingUsers && <option value="">Загружаем пользователей…</option>}
            {!loadingUsers && !users.length && <option value="">Нет доступных пользователей</option>}
            {users.map((user) => <option key={user.id} value={user.id}>{user.username.charAt(0).toUpperCase() + user.username.slice(1)} {user.email ? `— ${user.email}` : ''}</option>)}
          </select>

          <label htmlFor="note">Заметка</label>
          <textarea id="note" value={text} onChange={(event) => setText(event.target.value)} placeholder="Напишите что-нибудь важное…" rows="4" maxLength="1000" required />
          <div className="counter">{text.length}/1000</div>

          <button type="submit" disabled={loadingUsers || !users.length || !text.trim() || sending}>
            {sending ? 'Отправляем…' : 'Отправить'} <span aria-hidden="true">→</span>
          </button>
        </form>
        {message && <p className="feedback success" role="status">{message}</p>}
        {error && <p className="feedback error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
