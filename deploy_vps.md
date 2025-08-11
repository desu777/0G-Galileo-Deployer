# Kompletny Przewodnik Wdrożenia 0G-Galileo-Deployer na VPS

## 🎯 Rekomendowana wersja Node.js: **v20.18.2 LTS**

**Uzasadnienie wyboru:**
- Node.js v20 jest w fazie Maintenance LTS (do kwietnia 2026), co zapewnia stabilność i wsparcie bezpieczeństwa
- Pełna kompatybilność z kluczowymi pakietami:
  - Vite 6 wymaga Node.js 20.19+ (v20.18.2 jest kompatybilny)
  - React 18.3, Express.js 4, TypeScript 5.6 - pełne wsparcie
  - better-sqlite3, wagmi 2, viem, ethers.js 6 - potwierdzona kompatybilność
- Nie jest to najnowsza wersja (v22), co minimalizuje ryzyko problemów "wieku dziecięcego"
- Długi okres wsparcia pozwala na spokojną migrację w przyszłości

---

## 📋 KOMPLETNY PRZEWODNIK WDROŻENIA

### 1. Przygotowanie Serwera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja podstawowych narzędzi
sudo apt install -y curl git build-essential

# Konfiguracja zapory UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2. Instalacja Zależności Systemowych

```bash
# Instalacja Nginx
sudo apt install -y nginx

# Instalacja NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Przeładowanie profilu bash
source ~/.bashrc

# Instalacja Node.js v20.18.2 LTS
nvm install 20.18.2
nvm use 20.18.2
nvm alias default 20.18.2

# Weryfikacja instalacji
node --version  # Powinno wyświetlić: v20.18.2
npm --version

# Instalacja PM2 globalnie
npm install -g pm2

# Konfiguracja PM2 do uruchamiania przy starcie systemu
pm2 startup systemd
# Wykonaj komendę która zostanie wyświetlona
```

### 3. Pobranie Aplikacji

```bash
# Utworzenie katalogu dla aplikacji
sudo mkdir -p /var/www
cd /var/www

# Klonowanie repozytorium
sudo git clone https://github.com/desu777/0G-Galileo-Deployer.git
cd 0G-Galileo-Deployer

# Nadanie uprawnień dla użytkownika
sudo chown -R $USER:$USER /var/www/0G-Galileo-Deployer
```

### 4. Wdrożenie Backend (Compiler Service)

```bash
# Przejście do folderu compiler
cd /var/www/0G-Galileo-Deployer/compiler

# Instalacja zależności
npm install

# Instalacja brakujących typów TypeScript (jeśli potrzebne)
npm install --save-dev @types/better-sqlite3

# Budowanie projektu
npm run build

# Utworzenie pliku .env
cat > .env << 'EOF'
PORT=3101
FRONTEND_URL=https://deployer.desudev.xyz
EOF

# Uruchomienie aplikacji przez PM2
pm2 start dist/server.js --name "0g-compiler" --env production

# Zapisanie konfiguracji PM2
pm2 save
```

### 5. Wdrożenie Frontend

```bash
# Przejście do folderu front
cd /var/www/0G-Galileo-Deployer/front

# Instalacja zależności
npm install

# Utworzenie pliku .env
cat > .env << 'EOF'
VITE_COMPILER_API_URL=https://compiler.desudev.xyz
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_0G_RPC_URL=https://rpc-testnet.0g.ai
VITE_0G_EXPLORER_URL=https://testnet.0g.ai
EOF

# Budowanie aplikacji
npm run build

# Poprawka w vite.config.ts - dodanie allowed hosts
# Edytuj plik vite.config.ts i dodaj 'deployer.desudev.xyz' do allowedHosts

# Uruchomienie serwera preview przez PM2
pm2 start npm --name "0g-frontend" -- run preview -- --port 3100 --host 0.0.0.0

# Zapisanie konfiguracji PM2
pm2 save

# Sprawdzenie statusu aplikacji
pm2 list
```

### 6. Konfiguracja Nginx

```bash
# Usunięcie domyślnej konfiguracji
sudo rm -f /etc/nginx/sites-enabled/default

# Konfiguracja dla compiler.desudev.xyz
sudo tee /etc/nginx/sites-available/compiler.desudev.xyz << 'EOF'
server {
    listen 80;
    server_name compiler.desudev.xyz;

    location / {
        proxy_pass http://localhost:3101;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouty dla kompilacji
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Konfiguracja dla deployer.desudev.xyz
sudo tee /etc/nginx/sites-available/deployer.desudev.xyz << 'EOF'
server {
    listen 80;
    server_name deployer.desudev.xyz;

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support dla Web3
        proxy_read_timeout 86400;
    }
}
EOF

# Aktywacja konfiguracji
sudo ln -s /etc/nginx/sites-available/compiler.desudev.xyz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/deployer.desudev.xyz /etc/nginx/sites-enabled/

# Test konfiguracji
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. Zabezpieczenie SSL

```bash
# Instalacja Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generowanie certyfikatów SSL dla obu domen
sudo certbot --nginx -d compiler.desudev.xyz --non-interactive --agree-tos --email admin@desudev.xyz --redirect

sudo certbot --nginx -d deployer.desudev.xyz --non-interactive --agree-tos --email admin@desudev.xyz --redirect

# Konfiguracja automatycznego odnawiania certyfikatów
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test automatycznego odnawiania
sudo certbot renew --dry-run
```

### 8. Weryfikacja Wdrożenia

```bash
# Sprawdzenie statusu wszystkich usług
pm2 status

# Sprawdzenie logów
pm2 logs 0g-compiler --lines 50
pm2 logs 0g-frontend --lines 50

# Test dostępności endpointów
curl -I https://compiler.desudev.xyz
curl -I https://deployer.desudev.xyz

# Sprawdzenie statusu Nginx
sudo systemctl status nginx

# Sprawdzenie certyfikatów SSL
sudo certbot certificates
```

### 9. Komendy Utrzymania

```bash
# Restart aplikacji (po zmianach w kodzie)
pm2 restart 0g-compiler
pm2 restart 0g-frontend

# Monitorowanie w czasie rzeczywistym
pm2 monit

# Aktualizacja aplikacji z repozytorium
cd /var/www/0G-Galileo-Deployer
git pull origin main

# Przebudowanie i restart backendu
cd compiler
npm install
npm run build
pm2 restart 0g-compiler

# Przebudowanie i restart frontendu
cd ../front
npm install
npm run build
pm2 restart 0g-frontend
```

---

## 📝 Notatki

- System został przetestowany pod kątem kompatybilności z Ubuntu 24.04 LTS
- Node.js v20.18.2 LTS zapewnia optymalne wsparcie dla wszystkich komponentów
- PM2 automatycznie uruchomi aplikacje po restarcie serwera
- Certyfikaty SSL będą automatycznie odnawiane przez Certbot
- Frontend działa na porcie 3100, backend na porcie 3101
- Nginx przekierowuje ruch z domen na odpowiednie porty lokalnie
- Aplikacja znajduje się w katalogu `/var/www/0G-Galileo-Deployer`