import * as XLSX from 'xlsx';
import { EvidenceSource } from '../types';

export function parseFileContent(
  file: File,
  rawContent: string | ArrayBuffer
): Promise<Partial<EvidenceSource>> {
  return new Promise((resolve, reject) => {
    try {
      const fileName = file.name;
      const lowerName = fileName.toLowerCase();
      let records: Record<string, any>[] = [];
      let detectedColumns: string[] = [];
      let fileType: EvidenceSource['fileType'] = 'csv';

      if (lowerName.endsWith('.csv') || lowerName.endsWith('.tsv') || lowerName.endsWith('.txt')) {
        fileType = lowerName.endsWith('.txt') ? 'text' : 'csv';
        const workbook = XLSX.read(rawContent, { type: typeof rawContent === 'string' ? 'string' : 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
        fileType = 'xlsx';
        const workbook = XLSX.read(rawContent, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      } else {
        throw new Error(`Unsupported file type: ${fileName}. Please upload a CSV, XLSX, TXT, or Heatmap image.`);
      }

      if (records.length === 0) {
        throw new Error(`File ${fileName} is empty or contains no readable tabular data.`);
      }

      detectedColumns = Object.keys(records[0] || {});

      // Suggest column mappings based on common column naming patterns
      const columnMappings = detectSuggestedMappings(detectedColumns);

      // Check for empty feedback text rows
      let excludedCount = 0;
      const validRecords: Record<string, any>[] = [];

      records.forEach((row) => {
        let isBlank = false;
        if (columnMappings.feedbackTextCol) {
          const val = row[columnMappings.feedbackTextCol];
          if (val === undefined || val === null || String(val).trim() === '') {
            isBlank = true;
          }
        }
        if (isBlank) {
          excludedCount++;
        } else {
          validRecords.push(row);
        }
      });

      const exclusionNotes = excludedCount > 0
        ? `${excludedCount} blank or empty rows detected and excluded from analysis.`
        : undefined;

      resolve({
        id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fileName,
        fileType,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        recordCount: records.length,
        excludedCount,
        exclusionNotes,
        detectedColumns,
        columnMappings,
        previewRows: records,
        status: 'ready',
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

export function parseCsvString(csvString: string, fileName: string): Partial<EvidenceSource> {
  const workbook = XLSX.read(csvString, { type: 'string' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const records: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (records.length === 0) {
    throw new Error(`Data string contains no records.`);
  }

  const detectedColumns = Object.keys(records[0] || {});
  const columnMappings = detectSuggestedMappings(detectedColumns);

  let excludedCount = 0;
  records.forEach((row) => {
    if (columnMappings.feedbackTextCol) {
      const val = row[columnMappings.feedbackTextCol];
      if (val === undefined || val === null || String(val).trim() === '') {
        excludedCount++;
      }
    }
  });

  return {
    id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fileName,
    fileType: 'csv',
    uploadedAt: new Date().toISOString(),
    fileSize: csvString.length,
    recordCount: records.length,
    excludedCount,
    exclusionNotes: excludedCount > 0 ? `${excludedCount} blank rows excluded` : undefined,
    detectedColumns,
    columnMappings,
    previewRows: records,
    status: 'ready',
  };
}

export function detectSuggestedMappings(columns: string[]): {
  feedbackTextCol?: string;
  ratingCol?: string;
  dateCol?: string;
  segmentCol?: string;
  idCol?: string;
} {
  const mappings: {
    feedbackTextCol?: string;
    ratingCol?: string;
    dateCol?: string;
    segmentCol?: string;
    idCol?: string;
  } = {};

  const colLower = columns.map((c) => ({ original: c, lower: c.toLowerCase().replace(/[^a-z0-9]/g, '') }));

  // Feedback Text column
  const textMatches = ['feedbacktext', 'feedback', 'comment', 'comments', 'customercomment', 'text', 'review', 'description', 'message', 'notes', 'issue', 'quote'];
  const textCol = colLower.find((c) => textMatches.some((m) => c.lower.includes(m)));
  if (textCol) mappings.feedbackTextCol = textCol.original;

  // Rating column
  const ratingMatches = ['satisfactionrating', 'rating', 'stars', 'score', 'satisfaction', 'csat', 'nps'];
  const rCol = colLower.find((c) => ratingMatches.some((m) => c.lower.includes(m)));
  if (rCol) mappings.ratingCol = rCol.original;

  // Date column
  const dateMatches = ['createddate', 'date', 'createdat', 'timestamp', 'time', 'submittedat'];
  const dCol = colLower.find((c) => dateMatches.some((m) => c.lower.includes(m)));
  if (dCol) mappings.dateCol = dCol.original;

  // Segment column
  const segmentMatches = ['usersegment', 'segment', 'tier', 'plan', 'role', 'devicetype', 'device', 'accounttype'];
  const sCol = colLower.find((c) => segmentMatches.some((m) => c.lower.includes(m)));
  if (sCol) mappings.segmentCol = sCol.original;

  // ID column
  const idMatches = ['ticketid', 'id', 'ticket', 'caseid', 'userid', 'responseid', 'rowid'];
  const iCol = colLower.find((c) => idMatches.some((m) => c.lower.includes(m)));
  if (iCol) mappings.idCol = iCol.original;

  // Fallback: if no textCol found, pick the longest column name or first string col
  if (!mappings.feedbackTextCol && columns.length > 0) {
    mappings.feedbackTextCol = columns[columns.length - 1];
  }

  return mappings;
}
