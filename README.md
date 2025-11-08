### 요구 사항
* Docker 및 Docker Compose 

### 실행 순서

1.  **환경 변수 파일 생성:**
    루트 폴더의 `.env.example` 파일을 참고하여 **`.env`** 파일을 **생성**하고, `DB_USERNAME`, `JWT_SECRET` 등 필수 값을 설정합니다.
    ```bash
    cp .env.example .env
    ```

2.  **프로젝트 구동 (One-line):**
    DB 컨테이너와 Nest.js 서버 컨테이너를 빌드하고 구동합니다.
    ```bash
    docker-compose up --build
    ```
    (서버는 `http://localhost:3000`에서 실행됩니다.)

## 3. 📝 상세 API 명세 및 사용 예시

모든 API 경로는 `http://localhost:3000`를 기반으로 합니다. 모든 성공 응답은 `{"success": true, "statusCode": 2xx, "data": {...}}` 표준 형식으로 포장됩니다.

### 3.1. 👤 사용자 및 인증 (Auth)

#### `POST /api/users` (사용자 회원가입)
- **설명:** 새로운 사용자를 생성합니다.
- **인증:** 불필요
- **Request Body:**
  ```json
  {
    "email": "tester@example.com",
    "name": "tester_name",
    "password": "password1234"
  }
  ```
- **참고:** `password`는 8자 이상 20자 이하 필수

#### `GET /api/users` (모든 사용자 조회)
- **설명:** 모든 사용자의 정보를 조회합니다.
- **인증:** 불필요

#### `POST /api/auth/login` (로그인)
- **설명:** 이메일/비밀번호로 인증 후 Access/Refresh Token을 발급합니다.
- **인증:** 불필요
- **Request Body:**
  ```json
  {
    "email": "tester@example.com",
    "password": "password1234"
  }
  ```
- **Response (성공 시):**
  ```json
  {
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```

#### `POST /api/auth/token/refresh` (토큰 갱신)
- **설명:** Refresh Token이 유효할 경우 새 Access Token을 발급합니다.
- **인증:** `Authorization: Bearer <RefreshToken>` (필수)
- **Response (성공 시):**
  ```json
  {
    "accessToken": "..."
  }
  ```

### 3.2. 💰 포인트 관리 (Points)

모든 포인트 관리 API는 `Authorization: Bearer <AccessToken>` 헤더가 필요합니다.

#### `POST /api/earn` (포인트 적립)
- **설명:** 인증된 사용자에게 포인트를 적립합니다. (DB 트랜잭션 적용)
- **인증:** `Authorization: Bearer <AccessToken>` (필수)
- **Request Body:**
  ```json
  {
    "points": 100,
    "reason": "신규 가입 이벤트"
  }
  ```
- **Response (성공 시):**
  ```json
  {
      "userId": "uuid-or-username",
      "pointsAdded": 100,
      "currentBalance": 1100
  }
  ```

#### `GET /api/balance` (잔액 조회)
- **설명:** 인증된 사용자의 현재 포인트 잔액을 조회합니다.
- **인증:** `Authorization: Bearer <AccessToken>` (필수)
- **Response (성공 시):**
  ```json
  {
      "userId": "uuid-or-username",
      "balance": 1100,
      "lastUpdated": "2025-11-07T13:45:00Z"
  }
  ```

#### `GET /api/history` (내역 조회)
- **설명:** 인증된 사용자의 모든 포인트 변경 내역을 최신순으로 조회합니다.
- **인증:** `Authorization: Bearer <AccessToken>` (필수)
- **Response (성공 시):**
  ```json
  {
      "userId": "uuid-or-username",
      "transactions": [
        {
          "id": "txn-123",
          "type": "earn",
          "points": 100,
          "reason": "신규 가입 이벤트",
          "timestamp": "2025-11-07T13:45:00Z"
        }
      ]
  }
  ```