export type DocPart =
  | {uri: string; name?: string; type?: string} // image/file picked
  | null
  | undefined;

export type UploadDocsPayload = {
  document_front?: DocPart;
  document_back?: DocPart;
  license_front?: DocPart;
  license_back?: DocPart;
};

export type UserDocEntry = {
  type: 'document' | 'license';
  frontFilePath?: string | null;
  backFilePath?: string | null;
  expirationDate?: string | null;
  entryDate?: string | null;
};

export type UserWithDocs = {
  documentType: string;
  documentNumber: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  isActive: boolean;
  documents: UserDocEntry[];
};

export function buildFormData(payload: UploadDocsPayload) {
  const fd = new FormData();
  (
    [
      'document_front',
      'document_back',
      'license_front',
      'license_back',
    ] as const
  ).forEach(key => {
    const f = payload[key];
    if (f && f.uri) {
      const name = f.name ?? f.uri.split('/').pop() ?? `${key}.jpg`;
      const type = f.type ?? 'image/jpeg';
      // @ts-ignore RN FormData file
      fd.append(key, {uri: f.uri, name, type});
    }
  });
  return fd;
}
