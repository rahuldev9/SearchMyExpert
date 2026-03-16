# SearchMyExpert

SearchMyExpert is a full-stack web platform that connects **business owners with skilled experts** to collaborate on projects. Businesses can post project requirements and experts can apply to work on those projects.

The platform includes **project management, real-time collaboration, AI-based expert matching, and secure payment integration**.

---

# 🚀 Features

## Authentication & Authorization

- User registration and login
- Google OAuth authentication
- Role-based access (Business / Expert)
- Secure session handling
- Logout functionality
- Delete account option

---

# 👥 User Roles

## Business Users

Business users can:

- Create and manage projects
- Post project requirements
- Receive expert applications
- Accept or reject expert requests
- Download applicant lists (PDF, CSV, XLSX)
- Chat with experts
- Make payments after project completion
- Review expert performance

## Expert Users

Experts can:

- Browse available projects
- Apply for projects
- Receive project acceptance notifications
- Communicate with businesses
- Mark projects as completed
- Receive reviews and ratings

---

# 📊 Dashboards

The application includes separate dashboards for each role.

## Business Dashboard

- Create project
- Edit project
- View applications
- Accept experts
- Download application list
- Chat with experts
- Start payments
- Review expert performance

## Expert Dashboard

- View available projects
- Apply to projects
- Track accepted projects
- Chat with business users
- Mark project as completed
- View reviews

---

# 🔔 Notifications

The system provides real-time notifications for:

- New project postings
- Expert applications
- Project acceptance
- Project completion
- Payment updates

---

# 💬 Real-time Chat

Each project automatically creates a **chat system** between the business and the expert for collaboration and discussion.

---

# 🤖 AI Expert Matching

Businesses can describe the project requirements using natural language.

The AI system analyzes the requirements and recommends the most suitable experts.

---

# 💳 Payment System

Integrated payment gateways:

- Stripe
- Cashfree

After project completion:

1. Business initiates payment
2. Payment is processed
3. Expert receives confirmation
4. Business leaves review

---

# 🔍 Expert Discovery

Businesses can:

- Search experts globally
- View expert profiles
- Check skills and experience
- View ratings and reviews

---

# 📂 Project Workflow

1. Business posts project
2. Experts receive notification
3. Experts apply
4. Business reviews applications
5. Business accepts expert
6. Chat opens for discussion
7. Expert completes project
8. Business makes payment
9. Business leaves review
10. Project closed

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Authentication

- JWT Authentication
- Google OAuth
- Passport.js

## Payments

- Stripe
- Cashfree

## AI Integration

- AI expert recommendation system

---

# 📁 Project Structure

```
SearchMyExpert
│
├── client      # Frontend (Next.js)
│
├── server      # Backend (Node.js + Express)
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```
git clone https://github.com/yourusername/SearchMyExpert.git
```

## 2. Install Frontend

```
cd client
npm install
npm run dev
```

## 3. Install Backend

```
cd server
npm install
npm start
```

---

# 🌐 Environment Variables


Frontend `.env`
```
NEXT_PUBLIC_BACKEND_API=
OPENAI_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

Backend `.env`

```
PORT=5000
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
```

---



# 👨‍💻 Author

**Rahul Mudavath**

Bootcamp Project  
Full Stack Web Application
