// Type defination for meter record

export interface MeterContext {
  nmi: string | null;          // current NMI from last 200 record
  interval: number | null;     // interval length in minutes
  recordCount: number;         // counter of subrecords for logging
  totalIntervals: number;      // number of total intervals in a day for given interval period
}