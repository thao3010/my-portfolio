# Hướng dẫn cài project trên Windows (từ đầu)

Dành cho người **chưa có code local**. Làm **theo thứ tự**, không bỏ qua WSL.

## Phần 1 — Cài WSL (chỉ 1 lần)

1. Mở **PowerShell (Admin)**: Start → gõ `PowerShell` → Run as administrator  
2. Chạy:

```powershell
wsl --install -d Ubuntu
```

3. **Khởi động lại** máy nếu Windows yêu cầu.  
4. Mở app **Ubuntu** từ Start, tạo user/password Linux.

> Origin CLI **không** chạy trong PowerShell thường — các bước sau chạy trong **cửa sổ Ubuntu (WSL)**.

## Phần 2 — Công cụ trong Ubuntu

```bash
sudo apt update && sudo apt install -y git curl ca-certificates
node -v   # cần v20+; nếu chưa có: https://nodejs.org hoặc nvm
corepack enable && corepack prepare pnpm@9.15.9 --activate
```

Cài **Docker Desktop** trên Windows → Settings → Resources → **WSL integration** → bật Ubuntu.

## Phần 3 — Lấy code (Cursor Origin)

```bash
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
origin auth login
origin repo clone khang-doan/portfolio-builder-platform
cd portfolio-builder-platform
chmod +x scripts/setup-wsl.sh
./scripts/setup-wsl.sh
pnpm --filter @portfolio/api dev
```

Health check: http://localhost:3847/api/v1/health

## Phần 4 — Đẩy lên GitHub (tuỳ chọn)

```bash
git remote add github https://github.com/thao3010/my-portfolio.git
git push -u github main
```

Dùng **Personal Access Token** thay mật khẩu khi GitHub hỏi.

## Phần 5 — Lỗi thường gặp

| Triệu chứng | Cách xử lý |
|-------------|------------|
| `origin: command not found` | Thêm PATH như Phần 3, `source ~/.bashrc` |
| Chạy lệnh trong PowerShell/CMD | Mở **Ubuntu (WSL)** |
| `could not read Username` khi push GitHub | `origin auth login` hoặc PAT trên GitHub |
| `Docker not running` | Mở Docker Desktop, bật WSL integration |
| `pnpm: command not found` | `corepack enable` |
| Clone báo 401/403 | `origin auth login` lại |

Gửi **nguyên dòng lỗi đỏ** (copy text) khi nhờ hỗ trợ tiếp.
