# Flo NEM12 → SQL Parser (TypeScript)

A streaming CLI utility that converts Australian **NEM12** interval-meter files (`example.csv`) into ready-to-run SQL inserts (`output.sql`) for the `meter_readings` table.

---

## 📁 Project structure

```
avd-flo-nem/
├─ src/
│  └─ generateInserts.ts   # main driver program
│  ├─ handler.ts           # meter record handler logic
│  ├─ parseDate.ts         # helper for YYYYMMDD → Date
│  └─ context.ts           # shared interface/type definitions
│  └─ prepareSql.ts        # sql geenrator
├─ dist/                   # compiled JS (ignored in Git)
├─ example.csv             # sample input (add your own)
├─ output.sql              # generated SQL (after running)
├─ package.json
├─ tsconfig.json
└─ .gitignore
```

---

## 🚀 Quick start

1. **Install dependencies**

   ```bash
   npm install        # or: yarn
   ```

2. **Build the project** (compiles TS → JS into `dist/`):

   ```bash
   npm run build
   ```

3. **Process a Input file to generate Insert statements**
	
	Give the input file name and the output file name while running as shown below :

   ```bash
   # reads example.csv ⟶ writes output.sql
   node dist/generateInserts.js example.csv output.sql
   ```

   *Dev shortcut:*  
   ```bash
   # reads example.csv ⟶ writes output.sql
   # runs the TypeScript directly via `ts-node` for example.csv file and creates output.sql file.
   npm run dev
   ```


4. **(Optional) Load into MySQL**

   ```bash
   mysql -u your_user -p your_db < output.sql

   ```

---

## 🛠️ NPM scripts

| Script            | Purpose                                           |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Run TS directly with _ts-node_ (no build needed)  |
| `npm run build`   | Transpile to `dist/`                              |
| `npm start`       | Shortcut to run the compiled CLI                  |

---

## 📌 Improvement ideas

* Unit tests with Jest + fixture NEM12 files  
* Bulk-insert optimisation (`COPY` into Postgres)  
* Auto-detect 5-min & 15-min interval files  
* Direct stream to DB instead of writing SQL file

---
