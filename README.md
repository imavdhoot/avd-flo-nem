# Flo NEM12 → SQL Parser (TypeScript)

A streaming CLI utility that converts Australian **NEM12** interval-meter files (`example.csv`) into ready-to-run SQL inserts (`output.sql`) for the `meter_readings` table.

📘 See [Design Decisions & Implementation Summary](./design-decisions.md) for rationale and structure.

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
├─ design-decisions.md     # design choices summary
├─ package.json
├─ tsconfig.json
├─ README.md
└─ .gitignore
```

---

## 🚀 Quick start

1. **Install dependencies**

   ```bash
   npm install 
   ```

2. **Build the project** (compiles TS → JS into `dist/`):

   ```bash
   npm run build
   ```

3. **Process a Input file to generate Insert statements**
	
	Give the input file name and the output file name while running as shown below.
	With this, it reads input.csv and writes to ⟶ output.sql:

   ```bash
   node dist/generateInserts.js input.csv output.sql
   ```

   *Dev shortcut:*  
   ```bash
   npm run dev
   ```
   Uses the sample files to execute the code.
   Runs the TypeScript directly via `ts-node` for example.csv file and creates output.sql file.


4. **(Optional) Load into MySQL**

   ```bash
   mysql -u your_user -p your_db < output.sql

   ```

### 🗄️ SQL table schema

```sql
-- meter_readings: one row per interval reading
CREATE TABLE meter_readings (
    id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    nmi          VARCHAR(10) NOT NULL,       -- National Meter Identifier
    "timestamp"  TIMESTAMP   NOT NULL,       -- exact interval start time
    consumption  NUMERIC     NOT NULL,       -- energy value (kWh)

    -- stop duplicate uploads of the same interval for given NMI
    CONSTRAINT meter_readings_unique UNIQUE (nmi, "timestamp")
);
```   

---

## 🛠️ NPM scripts

| Script            | Purpose                                           |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Run TS directly with _ts-node_ (no build needed)  |
| `npm run build`   | Transpile to `dist/`                              |
| `npm run dev`     | Shortcut to run with given files                  |

---

## 📘 Additional Documentation

- [Design Decisions & Implementation Summary](./design-decisions.md)

## 📌 Improvement ideas

* Unit tests with Jest + fixture NEM12 files  
* Bulk-insert optimisation (instead of indivisual insert can modify as bulk query)
* Auto-detect 5-min & 15-min interval files  
* Direct stream to DB instead of writing SQL file

---
