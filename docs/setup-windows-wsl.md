# Cài project trên Windows (WSL)

Cloud Agent **không thể** chạy lệnh trên máy Windows của bạn. Bạn làm **một lần** theo các bước dưới trong **WSL** (Ubuntu).

## 1. Chuẩn bị

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — bật **WSL integration**
- Node.js 20+ trong WSL (`node -v`)

## 2. Lấy source code

### Cách A — từ GitHub (sau khi bạn đã push)

```bash
git clone https://github.com/thao3010/my-portfolio.git
cd my-portfolio
```

### Cách B — từ Cursor Origin

```bash
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
origin auth login
origin repo clone khang-doan/portfolio-builder-platform
cd portfolio-builder-platform
```

Nếu `origin: command not found`:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 3. Cài dependency & chạy API

```bash
chmod +x scripts/setup-wsl.sh
./scripts/setup-wsl.sh
pnpm --filter @portfolio/api dev
```

Mở trình duyệt: http://localhost:3847/api/v1/health

## 4. Đẩy code lên GitHub `my-portfolio` (nếu clone từ Origin)

```bash
git remote add github https://github.com/thao3010/my-portfolio.git
git push -u github main
```

Dùng PAT hoặc SSH nếu GitHub yêu cầu đăng nhập.
