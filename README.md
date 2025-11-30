# **CV. Bangunan Cerdas Indonesia — Smart Building: Smart Project Wall**

A modern **Next.js + Supabase + TailwindCSS** application for creating a digital “Projects Wall” — a place where users can upload projects, photos, and leave comments.

This project includes a scalable backend, responsive UI, and full deployment pipeline with **Vercel**.

---

## 🚀 **Features**

### **Core Features**

* 📸 Upload projects (photo + description)
* 🖼 Responsive gallery grid (auto-masonry)
* 💬 Comment system per Project
* 🔐 User authentication (Supabase Auth)
* ☁ Supabase Storage for images
* 🗄 Supabase Database (Projects + Comments tables)
* 🔄 Real-time comment updates (optional)
* 🎨 TailwindCSS + smooth UI

### **Tech Stack**

* **Next.js 14** (App Router)
* **TypeScript**
* **Supabase (Auth, Storage, Database)**
* **TailwindCSS**
* **Lucide Icons**

---

## 📁 **Project Structure**

```
/app
  /project
    /[id]
      page.tsx        # Detail project + comments
  page.tsx            # Gallery
  layout.tsx
/components
  CommentSection.tsx
  ProjectCard.tsx
/lib
  supabaseClient.ts
/public
/styles
  globals.css
```

---

# 🧰 **Setup & Installation**

## 1️⃣ Clone repository

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

## 2️⃣ Install dependencies

```bash
npm install
```

## 3️⃣ Add environment variables

Buat file:

```
.env.local
```

Isi dengan:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role
```

---

# 🗄 **Supabase Setup (Wajib)**

## 1. Create Supabase project

[https://app.supabase.com](https://app.supabase.com)

## 2. Enable Storage bucket

Bucket: **projects**

Policy: public read.

## 3. Create tables

SQL:

### **Table: projects**

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  image_url text,
  created_at timestamp default now(),
  user_id uuid references auth.users(id)
);
```

### **Table: comments**

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  Project_id uuid references memories(id) on delete cascade,
  user_id uuid references auth.users(id),
  text text,
  created_at timestamp default now()
);
```

---

# ▶️ **Run Development Server**

```bash
npm run dev
```

App will be available at:
👉 [http://localhost:3000](http://localhost:3000)

---

# ☁ **Deploy to Vercel**

## 1. Push to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

## 2. Deploy

* Go to [https://vercel.com](https://vercel.com)
* Import GitHub repo
* Add Environment Variables from `.env.local`

## 3. Set "Build & Output"

* Framework: **Next.js**
* Output: Automatic

## 4. Deploy

Vercel will auto-build using your Supabase config.

---

# 🔄 **GitHub Workflow (Recommended)**

## Update code

```bash
git pull
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically rebuild.

---

# 📌 **Useful Scripts**

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Run development         |
| `npm run build` | Build for production    |
| `npm start`     | Start production server |
| `npm run lint`  | Lint project            |

---

# 📜 **License**

MIT — feel free to use and modify.

---

# 🎉 **Done!**

README ini sudah lengkap, rapi, dan siap tempel ke GitHub repo kamu.
