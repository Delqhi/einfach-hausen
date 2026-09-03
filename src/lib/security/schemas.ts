import { z } from 'zod';

export const emailField = z.string().trim().toLowerCase()
  .min(5, 'E-Mail zu kurz').max(254, 'E-Mail zu lang')
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'Ungültige E-Mail');

export const passwordField = z.string().min(8, 'Passwort zu kurz').max(128, 'Passwort zu lang');

const shortText = (max: number) => z.string().trim().max(max);
const optionalShort = (max: number) => shortText(max).optional().default('');
const hhmm = z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Ungültige Uhrzeit');
// German decimal comma is accepted everywhere numeric form fields exist.
const normalizeDecimal = (v: unknown) => typeof v === 'string' ? v.trim().replace(',', '.') : v;
// Runtime wraps in z.preprocess; typed back to ZodNumber so callers keep
// number outputs and bound chaining stays readable.
const decimal = (schema: z.ZodTypeAny) => z.preprocess(normalizeDecimal, schema) as unknown as z.ZodNumber;
const boundedInt = (min: number, max: number, fallback: number) =>
  z.coerce.number().int().min(min).max(max).catch(fallback);

export const registerSchema = z.object({
  role: z.enum(['homeowner', 'provider']).catch('homeowner'),
  email: emailField,
  password: passwordField,
  firstName: z.string().trim().min(1, 'Vorname fehlt').max(100),
  lastName: z.string().trim().min(1, 'Nachname fehlt').max(100),
  phone: optionalShort(40),
  postcode: optionalShort(16),
  address: optionalShort(300),
  businessName: optionalShort(200),
  trades: optionalShort(500),
  radius: boundedInt(0, 300, 25),
  description: optionalShort(5000),
  streetAddress: optionalShort(200),
  emergencyMode: z.enum(['local', '24_7']).catch('local'),
  emergencyStart: hhmm.catch('18:00'),
  emergencyEnd: hhmm.catch('22:00'),
  emergencyMarkup: boundedInt(0, 100, 0),
  openingHours: optionalShort(500),
  bookableHours: optionalShort(500),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1).max(128),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(128),
});

export const providerMemberSchema = z.object({
  email: emailField,
  password: passwordField,
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  jobTitle: optionalShort(120),
  phone: optionalShort(40),
});

export const intakeDescriptionSchema = z.object({
  description: z.string().trim().min(3).max(8000),
});

export const verificationDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  adminNote: optionalShort(2000),
});

export const claimStatusSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'resolved', 'rejected']),
  adminNote: optionalShort(3000),
});

export const partnerContractSchema = z.object({
  status: z.enum(['pending', 'active', 'suspended', 'ended']),
  discountBps: z.coerce.number().int().min(0).max(3000),
  responseTarget: z.coerce.number().int().min(5).max(240),
  contractNotes: optionalShort(3000),
});

// Quote amounts arrive in whole euros and are stored in cents.
const MAX_QUOTE_EUR = 100_000;
const MAX_INVOICE_ITEMS = 50;
const MAX_ITEM_QTY = 10_000;
const MAX_ITEM_PRICE_EUR = 100_000;

export const quoteSchema = z.object({
  amount: decimal(z.coerce.number().int('Ungültiger Betrag').min(1, 'Betrag zu klein').max(MAX_QUOTE_EUR, 'Betrag zu groß')),
  availableAt: optionalShort(30),
  message: optionalShort(2000),
});

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1).max(300),
  quantity: decimal(z.coerce.number().min(0.01, 'Menge zu klein').max(MAX_ITEM_QTY, 'Menge zu groß')),
  unit: shortText(20),
  unitPriceEur: decimal(z.coerce.number().min(0).max(MAX_ITEM_PRICE_EUR, 'Preis zu groß')),
  taxRatePercent: decimal(z.coerce.number().min(0, 'Steuersatz ungültig').max(100, 'Steuersatz ungültig')),
});

const optionalIsoDate = z.union([
  z.literal(''),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum'),
]).optional().default('');

export const invoiceSchema = z.object({
  items: z.array(invoiceItemSchema).min(1, 'Mindestens eine Rechnungsposition erforderlich').max(MAX_INVOICE_ITEMS, 'Zu viele Rechnungspositionen'),
  issueDate: optionalIsoDate,
  serviceDate: optionalIsoDate,
  dueDate: optionalIsoDate,
  notes: optionalShort(1500),
});

export const emergencyTypeSchema = z.enum(['water', 'heating', 'electric', 'roof', 'lock', 'sanitary', 'other'])
  .catch('other');
