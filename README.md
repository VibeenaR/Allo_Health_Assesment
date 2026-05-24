# Allo Reservation System

A concurrent-safe, real-time inventory and reservation system built with Next.js, Prisma, and PostgreSQL. 

## 🚀 Key Features
* **Atomic Concurrency Control**: Uses Prisma transactions to guarantee that only one user successfully reserves the final unit of stock.
* **Hybrid Expiry Strategy**:
    * **Lazy Cleanup**: Validates reservation status upon access to ensure accuracy.
    * **Active Cleanup**: A background cron job handles automatic release of expired pending reservations.

## 🛠 Tech Stack
* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Database**: PostgreSQL (via Prisma ORM)

## ⚙️ Setup Instructions
1. **Clone the repository**: `git clone <your-repo-url>`
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**: Create a `.env` file in the root directory and add your `DATABASE_URL`.
4. **Run migrations**: `npx prisma migrate dev`
5. **Start development**: `npm run dev`

## 💡 Trade-offs & Future Improvements
* **Idempotency**: Future updates will include Redis-based idempotency keys to handle network retry scenarios.
* **Scalability**: While atomic database updates work well for current scale, high-frequency requests could be further optimized using a dedicated caching/distributed lock layer.