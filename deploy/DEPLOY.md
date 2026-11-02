# Docker'a geçiş (wheel-prod, Ubuntu 22.04)

Mevcut: gunicorn systemd servisi (127.0.0.1:8000), Next.js :3000, Postgres host'ta,
Nginx + Certbot host'ta. Hedef: ikisi de Docker, Nginx/Certbot/Postgres host'ta kalır.

## 0. Ön hazırlık (kesinti yok)

1. **Yedek:** `sudo -u postgres pg_dump <db_adi> > ~/wheel_$(date +%F).sql`
2. **Postgres'i konteynerden erişilebilir yap** (konteyner docker ağından gelir, 172.16.0.0/12):
   - `/etc/postgresql/14/main/postgresql.conf` → `listen_addresses` zaten `*`.
   - `/etc/postgresql/14/main/pg_hba.conf` sonuna:
     `host  <db_adi>  <db_kullanici>  172.16.0.0/12  scram-sha-256`
   - `sudo systemctl reload postgresql`
   - **Güvenlik:** 5432 şu an `0.0.0.0`'da dinliyor. `sudo ufw status` ile internetten
     kapalı olduğunu doğrula; docker ağına izin için: `sudo ufw allow from 172.16.0.0/12 to any port 5432`.
3. Eski backend `.env`'i (`/home/wheelproject/luckofWheel/.env`) referans al. Yenisinde
   `DATABASE_URL` host'u `localhost` yerine **`host.docker.internal`** olmalı. Şablon: backend `.env.example`.
4. Frontend için sunucuda `.env` hazırla (şablon `.env.example`):
   `NEXT_PUBLIC_BASE_URL=https://api.cevirkazan360.com`, `NEXT_PUBLIC_SITE_URL=https://cevirkazan360.com`,
   `API_INTERNAL_URL=` boş, `NEXT_PUBLIC_WHATSAPP_NUMBER=905...`

## 1. Backend geçişi (kısa kesinti)

Sunucudaki `/home/wheelproject/luckofWheel` eski kod: `Dockerfile`, `docker-compose.yml`,
`docker-entrypoint.sh` yok. Önce `ls -a` ile `.git` ve `.env` var mı bak.

```bash
cd /home/wheelproject/luckofWheel
ls -a                                  # .git ve .env var mı?

# Yedek: yüklenmiş görseller + eski .env
cp -a public ~/public_images_backup_$(date +%F)
cp .env ~/env_backup_$(date +%F) 2>/dev/null

# Yeni kodu getir:
#  - .git varsa: git pull
#  - yoksa yerelden: rsync -av --exclude .venv --exclude venv --exclude .env --exclude public \
#      --exclude static --exclude __pycache__ ./ root@SUNUCU:/home/wheelproject/luckofWheel/
#    (public hariç tutulur: sunucudaki görseller ezilmesin)
# Gelmesi gerekenler: Dockerfile, docker-compose.yml, docker-entrypoint.sh, .dockerignore, requirements.txt

# Konteyner "app" kullanıcısı (uid 1001) yeni görsel yükleyebilsin:
sudo chown -R 1001 public

# .env prod değerleriyle hazır (DEBUG=False, ALLOWED_HOSTS=api.cevirkazan360.com,
# DATABASE_URL host'u host.docker.internal, ...)
sudo systemctl stop gunicorn && sudo systemctl disable gunicorn   # 8000 portunu boşalt
docker compose up -d --build          # entrypoint: migrate + collectstatic + gunicorn
docker compose logs -f web
curl -I http://127.0.0.1:8000/
```

`public/` repo'da takipliyse `git pull` sunucudaki dosyalarla çakışabilir; yerelde varsayılan
görseller (logolar) repo'dan, yüklenenler (`staff/` vb.) sunucudan gelir. Çakışırsa
`git stash` yerine önce yedekten karşılaştır, sonra devam et.

Geri dönüş: `docker compose down && sudo systemctl enable --now gunicorn`

## 2. Frontend geçişi

```bash
cd <frontend dizini>
git pull
# 3000'i tutan eski süreci durdur (nasıl başladığına bağlı: systemctl / kill)
docker compose up -d --build
curl -I http://127.0.0.1:3000/
```

## 3. Nginx

```bash
sudo cp /etc/nginx/sites-enabled/api.conf ~/api.conf.bak
sudo cp deploy/nginx.prod.conf /etc/nginx/sites-enabled/api.conf
sudo nginx -t && sudo systemctl reload nginx
```

`public/images` alias yolu backend dizinine bağlı (`/home/wheelproject/luckofWheel/public/images/`).
Backend başka dizindeyse `nginx.prod.conf` içindeki yolu değiştir.

## 4. Doğrulama

- `https://cevirkazan360.com` açılıyor, çark ve giriş çalışıyor
- `https://api.cevirkazan360.com/public/images/cevirkazan360-koyu-zemin-v2.png` geliyor
- `docker ps` iki konteyner `healthy/Up`, `ss -tlnp | grep -E '3000|8000'` sadece `127.0.0.1` gösteriyor
- `sudo certbot renew --dry-run` başarılı (Nginx değişmediği için yenileme aynen çalışır)

## Güncelleme akışı

Backend ve frontend: `git pull && docker compose up -d --build`.
Yeni migration varsa konteyner açılırken otomatik uygulanır (`docker-entrypoint.sh`).
Migration dosyaları local'de `makemigrations` ile üretilip commit edilmeli.
