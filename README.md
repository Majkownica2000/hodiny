# Čas serveru (Flask)

Analogové hodiny zobrazující čas serveru v „liquid glass" designu.

## Spuštění

```bash
pip install -r requirements.txt
python app.py
```

Aplikace běží na http://127.0.0.1:5000

## Struktura

- `app.py` – Flask server, endpoint `/` a `/api/time`
- `templates/index.html` – úvodní stránka
- `static/css/style.css` – liquid glass styl
- `static/js/clock.js` – živé hodiny synchronizované se serverem
