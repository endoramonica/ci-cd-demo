# BaiTap7 - CI/CD Pipeline với GitLab

## 1) Mục tiêu

- Hiểu và phân biệt khái niệm **CI (Continuous Integration)** và **CD (Continuous Deployment)**
- Sử dụng **GitLab CI** để tạo pipeline tự động
- Cấu hình **GitLab Pages** để deploy website tĩnh miễn phí
- Theo dõi và phân tích pipeline status, jobs, artifacts
- Hiểu vai trò của **Runner**, **Stages**, **Jobs**, **Artifacts** trong CI/CD

---

## 2) Yêu cầu chung

### 2.1 Quy mô nhóm

- Team size: **3 người** (đơn giản hơn các bài trước vì không cần code phức tạp)
- Gợi ý vai trò:
  - 1 bạn phụ trách cấu hình GitLab CI + viết `.gitlab-ci.yml`
  - 1 bạn phụ trách tạo static site (HTML/CSS/JS)
  - 1 bạn phụ trách viết document + chụp screenshots + tổng hợp

### 2.2 Đầu ra bắt buộc

- File `.gitlab-ci.yml` cấu hình pipeline hoàn chỉnh
- Static website trong thư mục `public/` được deploy lên GitLab Pages
- Screenshots pipeline: **Pipelines** page, **Jobs** page, **live site URL**
- Trang web live tại GitLab Pages (public URL)

---

## 3) Khái niệm CI/CD

### 3.1 CI - Continuous Integration (Tích hợp liên tục)

Mỗi khi developer push code, hệ thống CI tự động:

- **Build** project
- **Run** automated tests
- **Check** code quality

> Mục đích: phát hiện lỗi sớm, giảm conflict khi merge code.

### 3.2 CD - Continuous Deployment (Triển khai liên tục)

Sau khi CI pass thành công, hệ thống CD tự động:

- **Deploy** phiên bản mới lên staging/production
- **Verify** deployment thành công
- **Notify** team qua email/slack

> Mục đích: release nhanh, giảm thủ công, feedback sớm.

### 3.3 CI/CD Pipeline Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  Commit  │ -> │  Build   │ -> │   Test   │ -> │   Deploy     │
│  & Push  │    │  Stage   │    │  Stage   │    │   Stage      │
└──────────┘    └──────────┘    └──────────┘    └──────────────┘
     ^                                                   ^
     │                                                   │
     └────────── Triggered on every push ───────────────┘
```

**Mỗi stage chỉ chạy khi stage trước đó thành công. Nếu 1 stage fail, các stage sau sẽ không chạy.**

---

## 4) GitLab CI/CD Concepts

### 4.1 Pipeline

Tập hợp toàn bộ các jobs được chạy khi trigger. Mỗi push tạo 1 pipeline mới.

### 4.2 Stages

Nhóm các jobs chạy **song song** với nhau. Thứ tự stages: `.pre` -> stage1 -> stage2 -> ... -> `.post`

Mặc định GitLab CI có các stages: `build`, `test`, `deploy`

### 4.3 Jobs

Đơn vị nhỏ nhất trong pipeline. Mỗi job chứa:

- `script`: các lệnh shell cần chạy
- `stage`: thuộc stage nào
- `rules`: điều kiện chạy job

### 4.4 Runner

Server (máy ảo hoặc container) thực thi các jobs. GitLab.com cung cấp **shared runners** miễn phí cho tất cả repository.

### 4.5 Artifacts

Các file được jobs tạo ra (VD: compiled code, build output). Artifacts có thể được chia sẻ giữa các jobs/stages.

### 4.6 .gitlab-ci.yml

File cấu hình pipeline bằng YAML, đặt ở **root** của repository. Đây là file duy nhất cần tạo để GitLab CI hoạt động.

---

## 5) GitLab Pages

GitLab Pages là dịch vụ hosting miễn phí cho static websites, tích hợp sẵn trong GitLab.

### 5.1 Đặc điểm

| Tiêu chí | Chi tiết |
|----------|----------|
| **Chi phí** | Miễn phí 100% |
| **Dung lượng** | 10 GB storage/repository |
| **Bandwidth** | Không giới hạn |
| **Custom domain** | Hỗ trợ |
| **SSL** | Tự động qua Let's Encrypt |
| **Runner** | Dùng shared runner của GitLab (không cần setup riêng) |

### 5.2 URL mặc định

```
https://[username].gitlab.io/[project-name]/
```

---

## 6) Hướng dẫn từng bước

### Bước 1: Fork hoặc tạo GitLab Repository

1. Truy cập **GitLab.com** → Đăng nhập
2. Fork repo `1211060327-buimanhtoan` hoặc tạo repo mới
3. Clone về máy local

### Bước 2: Tạo cấu trúc thư mục BaiTap7

```
BaiTap7/
├── .gitlab-ci.yml
├── public/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       └── main.js
└── SCREENSHOTS/
```

### Bước 3: Viết file `.gitlab-ci.yml`

Tạo file tại root của BaiTap7 (hoặc root repo):

```yaml
stages:
  - deploy

pages:
  stage: deploy
  script:
    - echo "Deploying to GitLab Pages..."
    - echo "Pipeline executed at: $(date)"
  artifacts:
    paths:
      - public
    expire_in: 1 day
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

**Giải thích:**

| Directive | Giá trị | Ý nghĩa |
|-----------|---------|----------|
| `stages` | `deploy` | Chỉ có 1 stage: deploy |
| `pages` | - | Job tên `pages` (tên đặc biệt của GitLab Pages) |
| `stage` | `deploy` | Job chạy ở stage deploy |
| `script` | `echo ...` | Lệnh thực thi khi job chạy |
| `artifacts.paths` | `public` | GitLab Pages deploy từ thư mục `public` |
| `rules.if` | `$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH` | Chỉ chạy khi push lên branch `main` |

### Bước 4: Tạo static website

Tạo file `public/index.html`, `public/styles.css`, `public/js/main.js` với nội dung CI/CD demo (tham khảo thư mục `BaiTap7/public/` trong repo).

### Bước 5: Push và theo dõi Pipeline

1. Commit tất cả files lên repository
2. Truy cập **Repository > CI/CD > Pipelines**
3. Click vào pipeline vừa được tạo
4. Quan sát `pages` job chạy
5. Đợi job **passed** (thường mất 1-3 phút)

### Bước 6: Bật GitLab Pages (nếu cần)

1. Vào **Settings > General > Visibility**
2. Mở rộng phần **GitLab Pages**
3. Toggle **Enable Pages** (thường đã bật sẵn)
4. Lưu thay đổi

### Bước 7: Truy cập live site

1. Vào **Deploy > Pages**
2. Copy URL (thường là `https://[username].gitlab.io/[project-name]/`)
3. Mở trên trình duyệt → Xem website đã deploy

### Bước 8: Chụp Screenshots

Chụp ảnh minh chứng:

| Ảnh | Mô tả | Location trong GitLab |
|-----|--------|----------------------|
| `pipeline-success.png` | Pipeline status: passed | CI/CD > Pipelines |
| `pipeline-jobs.png` | Chi tiết jobs trong pipeline | CI/CD > Jobs |
| `pages-url.png` | Live URL của GitLab Pages | Deploy > Pages |

---

## 7) Mở rộng: Thêm Stages (nâng cao)

Nếu muốn thực hành thêm, thử cấu hình pipeline với nhiều stages:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Building the project..."
    - echo "Build completed at: $(date)"
  artifacts:
    paths:
      - public/
    expire_in: 1 day

test:
  stage: test
  script:
    - echo "Running tests..."
    - echo "Checking HTML syntax..."
    - test -f public/index.html && echo "index.html exists" || exit 1
    - test -f public/styles.css && echo "styles.css exists" || exit 1
    - test -f public/js/main.js && echo "main.js exists" || exit 1

pages:
  stage: deploy
  script:
    - echo "Deploying to GitLab Pages..."
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

**Điều gì xảy ra khi sửa code và push?**

1. Pipeline trigger → chạy **build** → **test** → **deploy**
2. Nếu build fail → test không chạy → deploy không chạy
3. Nếu test fail → deploy không chạy
4. Nếu tất cả pass → site được deploy

---

## 8) Câu hỏi ôn tập

### Câu 1: CI khác CD chỗ nào?

> **CI** tập trung vào việc tự động build và test mỗi khi có thay đổi code. **CD** mở rộng CI bằng cách tự động deploy phiên bản đã pass CI lên môi trường.

### Câu 2: Runner là gì? Ai cung cấp runner?

> Runner là server/container thực thi các jobs trong pipeline. GitLab.com cung cấp **shared runners** miễn phí, không cần cài đặt riêng.

### Câu 3: Artifacts dùng để làm gì?

> Artifacts là các file được jobs tạo ra và có thể chia sẻ giữa các jobs. Ví dụ: build output từ job `build` có thể được `deploy` job sử dụng.

### Câu 4: Pipeline fail ở stage test, stage deploy có chạy không?

> **Không.** Stages chạy tuần tự. Nếu 1 stage fail, các stage sau sẽ không được thực thi.

### Câu 5: Làm sao để pipeline chỉ chạy trên branch `main`?

> Dùng `rules` trong job:
> ```yaml
> rules:
>   - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
> ```

### Câu 6: Muốn chạy pipeline trên mọi branch?

> Bỏ `rules` hoặc dùng:
> ```yaml
> rules:
>   - if: $CI_COMMIT_BRANCH
> ```

---

## 9) Nguồn tham khảo

| Nguồn | URL |
|--------|-----|
| GitLab CI/CD Quick Start | https://docs.gitlab.com/ee/ci/quick_start/ |
| GitLab Pages - HTML Manual | https://docs.gitlab.com/ee/user/project/pages/getting_started/pages_html.html |
| GitLab CI/CD YAML Reference | https://docs.gitlab.com/ee/ci/yaml/ |
| GitLab CI/CD Pipelines | https://docs.gitlab.com/ee/ci/pipelines/ |
| GitLab Pages Settings | https://docs.gitlab.com/ee/user/project/pages/ |

---

## 10) Yêu cầu nộp bài

### 10.1 Deliverables

1. **`.gitlab-ci.yml`** — file cấu hình pipeline (đặt ở root repo)
2. **Static website** — thư mục `public/` với HTML/CSS/JS
3. **Screenshots** trong thư mục `SCREENSHOTS/`:
   - `pipeline-success.png` — Pipeline passed
   - `pipeline-jobs.png` — Chi tiết các jobs
   - `pages-url.png` — URL GitLab Pages live

### 10.2 Minh chứng Pipeline

- Screenshot pipeline status: tất cả jobs **passed**
- Pipeline chạy thành công sau khi push code
- GitLab Pages URL hoạt động và hiển thị website

---

## 11) Tiêu chí chấm điểm

| Tiêu chí | Điểm |
|----------|------|
| **`.gitlab-ci.yml` cấu hình đúng cú pháp** | 20% |
| **Pipeline chạy thành công (passed)** | 25% |
| **GitLab Pages deploy hoạt động (live URL)** | 25% |
| **Screenshots minh chứng đầy đủ** | 15% |
| **Trả lời đúng các câu hỏi ôn tập** | 15% |

---

## 12) Tài liệu hướng dẫn nhanh (Cheat Sheet)

### .gitlab-ci.yml Syntax

```yaml
stages:              # Khai báo danh sách stages (thứ tự chạy)
  - build
  - test
  - deploy

job-name:            # Tên job tự chọn
  stage: build       # Thuộc stage nào
  script:            # Lệnh shell thực thi
    - echo "Hello"
  rules:             # Điều kiện chạy job
    - if: $CI_COMMIT_BRANCH == "main"
  artifacts:         # File output chia sẻ
    paths:
      - output/
```

### Lệnh Git thường dùng

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Truy cập nhanh

| Mục | Đường dẫn GitLab |
|------|-----------------|
| Pipelines | `Repository > CI/CD > Pipelines` |
| Jobs | `Repository > CI/CD > Jobs` |
| Pipeline Editor | `Repository > CI/CD > Editor` |
| Pages Settings | `Settings > Pages` |

---

## 13) Bắt đầu

1. **Clone** repository về máy - done 
2. **Tạo** thư mục `BaiTap7/` với cấu trúc như trên - done 
3. **Copy** `.gitlab-ci.yml` vào root repository - check - report yes / no 
4. **Tạo** static site trong `public/`
5. **Commit & Push** → Quan sát pipeline chạy
6. **Chờ** 1-3 phút → Kiểm tra GitLab Pages URL
7. **Screenshot** kết quả
8. setuo repos chặn push trực tiếp vào main 
9. steup pipeline rules chỉ chạy ci trong merge request
10. setup pipeline chỉ chạy stage deploy  thủ công manual khi bấm nút 
