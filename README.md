# Аккаунты и заметки

Небольшой пример Django REST API и React-интерфейса.

## Запуск Django

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Добавьте пользователей через `/admin/` (или создайте их в Django shell). `GET /api/users/` возвращает аккаунты, а `POST /api/notes/` валидирует пользователя и текст и сохраняет заметку в SQLite.

## Запуск React

В другом терминале:

```bash
cd frontend
npm install
npm run dev
```

Откройте адрес Vite (обычно `http://localhost:5173`). Django API ожидается по адресу `http://127.0.0.1:8000`.

## API

`GET /api/users/` → `[{ "id": 1, "username": "ali", "email": "ali@example.com" }]`

`POST /api/notes/` с JSON `{"user_id": 1, "text": "Не забыть сделать домашку"}` сохраняет запись и отвечает HTTP 201: `{"message":"Заметка создана","user_id":1,"text":"Не забыть сделать домашку"}`. Ошибочный или пустой текст и несуществующий `user_id` возвращают ошибки валидации.
