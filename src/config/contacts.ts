export type SupportContact = {
  label: string;
  href: string;
};

export type SupportContacts = {
  email: SupportContact | null;
  phone: SupportContact | null;
  whatsapp: SupportContact | null;
};

function firstConfigured(...values: Array<string | undefined>) {
  return values.map(value => value?.trim()).find(Boolean) || '';
}

function supportEmail(): SupportContact | null {
  const value = firstConfigured(
    process.env.EH_SUPPORT_EMAIL,
    process.env.SUPPORT_EMAIL,
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  ).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return { label: value, href: `mailto:${value}` };
}

function supportPhone(): SupportContact | null {
  const value = firstConfigured(
    process.env.EH_SUPPORT_PHONE,
    process.env.SUPPORT_PHONE,
    process.env.NEXT_PUBLIC_SUPPORT_PHONE,
  );
  if (!value || !/^[+\d][\d\s().\/-]{6,30}$/.test(value)) return null;
  const dial = `${value.startsWith('+') ? '+' : ''}${value.replace(/\D/g, '')}`;
  if (dial.replace(/\D/g, '').length < 7) return null;
  return { label: value, href: `tel:${dial}` };
}

function supportWhatsapp(): SupportContact | null {
  const value = firstConfigured(
    process.env.EH_SUPPORT_WHATSAPP,
    process.env.SUPPORT_WHATSAPP_NUMBER,
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP,
  );
  const digits = value.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return { label: value || digits, href: `https://wa.me/${digits}` };
}

export function getSupportContacts(): SupportContacts {
  return {
    email: supportEmail(),
    phone: supportPhone(),
    whatsapp: supportWhatsapp(),
  };
}
