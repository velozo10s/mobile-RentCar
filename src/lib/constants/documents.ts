export interface DocumentOption {
  id: string;
  labelKey: string;
}

export const SUPPORTED_DOCUMENTS: DocumentOption[] = [
  {id: 'CI', labelKey: 'documentTypes.id'},
  {id: 'PASSPORT', labelKey: 'documentTypes.passport'},
];
