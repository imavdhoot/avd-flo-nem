// Type defination for meter record

export interface MeterContext {
  nmi: string | null;          // current NMI from last 200 record
  interval: number | null;     // interval length in minutes
  recordCount: number;
}