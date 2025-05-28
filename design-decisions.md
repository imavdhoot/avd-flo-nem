# Design Decisions & Implementation Summary

## ✅ Q1. What is the rationale for the technologies you have decided to use?

- **Priod experience**: I got extensive experience in NodeJs to do similar processing in my privious companies,
that's why chose Nodejs. 
- Steaming modules support: But apart from this, chose  **TypeScript with Node.js** for its fast development cycle, strong typing, and built-in support for file streaming via the `fs` and `line-reader` modules. 
- TypeScript helped prevent common issues like null/undefined access during parsing, and ensured better maintainability.
- So to handle potentially large input files(few GB) efficiently, I initially used `readline`, but later switched to `line-reader` to enforce one-line-at-a-time processing with callbacks. **This avoids memory pressure** and ensures sequential parsing so that script doesnt abruptly stops due to memory issues
- I've personally used **line-reader** module recently to handle 6M record file to do similar processing of user records and observed it runs smoothly without any memory issues on production level.
- I avoided any heavy ORM or database driver since the goal was to generate plain SQL files. 
- A lightweight logging utility was also added to improve observability without introducing extra dependencies.

---

## ✅ Q2. What would you have done differently if you had more time?

If I had more time, I would have added:

- **Unit and integration tests** for line parsers and handlers using Jest.
- **bulk-Operation/Query support** Instead of generating indivisual queries can use bulk insert query for same NEM.
- **Direct Insert to SQL DB** - instead of generating file, direct insert to DB can be added gracefully to avoid any manual work
- **separate error log file** - for more transparency on production env and more error handling for malformed lines
- **possibly a real-time progress indicator** - to show how much data has been processed till now

---

## ✅ Q3. What is the rationale for the design choices that you have made?

- I've used a **context object** (`MeterContext`) to maintain state across 200/300 records without relying on globals.
- **Pure functions** were created for parsing (`handler`), timestamp calculation, and SQL generation (`prepareSQL`), making the code modular and easy to test.
- Streaming and **backpressure-aware writing** were prioritized to handle large files efficiently with constant memory usage.
- For clarity in time calculations, I used time constants like `60_000` (ms per minute) and 1440 (min per day) with numeric separators.
- Logs were routed through a **timestamped logger utility** instead of raw `console.log` for cleaner traceability.
- The overall structure favors **simplicity, extensibility, and safe defaults**, with a clear path to production hardening.

These choices allowed me to stay within the half-day scope while still aligning with production-quality patterns.