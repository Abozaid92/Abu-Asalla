export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "tags";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[]; // لـ select
  placeholder?: string;
};

export type ColumnConfig = {
  key: string;
  label: string;
  // لعرض قيمة مُنسّقة في الجدول بدل القيمة الخام (مثلاً تحويل enum لعربي)
  render?: (row: any) => string;
};

export type ResourceConfig = {
  resource: string;
  title: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
};
