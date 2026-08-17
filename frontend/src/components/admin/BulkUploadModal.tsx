"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { productsApi, ApiError, type BackendCategory, type BulkCreateResult } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import {
  Download,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  categories: BackendCategory[];
  onImported: () => void;
}

const TEMPLATE_HEADERS = [
  "Name",
  "Description",
  "Category",
  "Price (₹)",
  "Compare-at Price (₹)",
  "Weight / Variant",
  "Stock Quantity",
  "Image URL",
];

interface ParsedRow {
  rowNumber: number;
  name: string;
  categoryName: string;
  price: string;
  quantity: string;
  error?: string;
  payload?: Record<string, unknown>;
}

function cellText(row: import("exceljs").Row, col?: number): string {
  if (!col) return "";
  const v = row.getCell(col).value;
  if (v == null) return "";
  if (typeof v === "object" && v !== null) {
    if ("text" in v) return String((v as { text: unknown }).text ?? "").trim();
    if ("result" in v) return String((v as { result: unknown }).result ?? "").trim();
    if ("richText" in v) {
      return (v as { richText: { text: string }[] }).richText.map((r) => r.text).join("").trim();
    }
  }
  return String(v).trim();
}

export function BulkUploadModal({ open, onClose, categories, onImported }: BulkUploadModalProps) {
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{
    created: number;
    failed: number;
    errors: { row: number; message: string }[];
  } | null>(null);
  const [parseError, setParseError] = useState("");

  function reset() {
    setRows([]);
    setFileName("");
    setResults(null);
    setParseError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleDownloadTemplate() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products");
    sheet.addRow(TEMPLATE_HEADERS);
    sheet.addRow([
      "Kaju (Cashew Nuts)",
      "Handpicked, natural cashews sourced directly from trusted growers.",
      "Dry Fruits",
      799,
      899,
      "500 g",
      120,
      "https://example.com/images/kaju.jpg",
    ]);
    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((col) => {
      col.width = 24;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zumbii-product-import-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  function findCategoryId(name: string): string | null {
    const target = name.trim().toLowerCase();
    const match = categories.find((c) => c.name.trim().toLowerCase() === target);
    return match?.id ?? null;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    reset();
    setFileName(file.name);
    setParsing(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);
      const sheet = workbook.worksheets[0];
      if (!sheet) throw new Error("No sheet found in this file");

      const headerMap: Record<string, number> = {};
      sheet.getRow(1).eachCell((cell, colNumber) => {
        headerMap[String(cell.value ?? "").trim().toLowerCase()] = colNumber;
      });

      const getCol = (label: string) => headerMap[label.toLowerCase()];
      const nameCol = getCol("Name");
      const descCol = getCol("Description");
      const catCol = getCol("Category");
      const priceCol = getCol("Price (₹)");
      const compareCol = getCol("Compare-at Price (₹)");
      const weightCol = getCol("Weight / Variant");
      const qtyCol = getCol("Stock Quantity");
      const imageCol = getCol("Image URL");

      if (!nameCol || !priceCol || !catCol || !qtyCol) {
        setParseError(
          "This file is missing required columns. Please use the template — Name, Category, Price (₹), and Stock Quantity are required."
        );
        return;
      }

      const parsed: ParsedRow[] = [];
      const usedSlugs = new Set<string>();

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const name = cellText(row, nameCol);
        const description = cellText(row, descCol);
        const categoryName = cellText(row, catCol);
        const price = cellText(row, priceCol);
        const comparePrice = cellText(row, compareCol);
        const weightVariant = cellText(row, weightCol);
        const quantity = cellText(row, qtyCol);
        const imageUrl = cellText(row, imageCol);

        if (!name && !categoryName && !price && !quantity) return;

        const priceNum = Number(price);
        const qtyNum = Number(quantity);
        const compareNum = comparePrice ? Number(comparePrice) : undefined;
        const categoryId = categoryName ? findCategoryId(categoryName) : null;

        let error: string | undefined;
        if (!name) error = "Name is required";
        else if (!categoryName) error = "Category is required";
        else if (!categoryId) error = `Category "${categoryName}" not found`;
        else if (!price || Number.isNaN(priceNum) || priceNum < 0) error = "Invalid price";
        else if (quantity === "" || Number.isNaN(qtyNum) || qtyNum < 0) error = "Invalid stock quantity";
        else if (comparePrice && (compareNum === undefined || Number.isNaN(compareNum) || compareNum < 0))
          error = "Invalid compare-at price";

        let payload: Record<string, unknown> | undefined;
        if (!error) {
          let slug = slugify(name);
          let suffix = 2;
          while (usedSlugs.has(slug)) {
            slug = `${slugify(name)}-${suffix++}`;
          }
          usedSlugs.add(slug);

          payload = {
            name,
            slug,
            description: description || undefined,
            shortDesc: weightVariant || undefined,
            price: priceNum,
            comparePrice: compareNum,
            sku: `SKU-${Date.now()}-${rowNumber}`,
            quantity: qtyNum,
            categoryId,
            images: imageUrl ? [imageUrl] : [],
          };
        }

        parsed.push({ rowNumber, name, categoryName, price, quantity, error, payload });
      });

      setRows(parsed);
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Could not read this file. Make sure it's a valid .xlsx file."
      );
    } finally {
      setParsing(false);
      e.target.value = "";
    }
  }

  async function handleImport() {
    const validRows = rows.filter((r) => !r.error && r.payload);
    if (validRows.length === 0) return;
    setSubmitting(true);
    setParseError("");
    try {
      const res: BulkCreateResult = await productsApi.bulkCreate(validRows.map((r) => r.payload!));
      const errors = res.results
        .filter((r): r is Extract<typeof r, { success: false }> => !r.success)
        .map((r) => ({ row: validRows[r.index].rowNumber, message: r.error }));
      setResults({ created: res.created, failed: res.failed, errors });
      if (res.created > 0) onImported();
    } catch (err) {
      setParseError(err instanceof ApiError ? err.message : "Bulk import failed");
    } finally {
      setSubmitting(false);
    }
  }

  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.length - validCount;

  return (
    <Modal open={open} onClose={handleClose} title="Bulk Upload Products" size="xl">
      <div className="px-6 pb-6 pt-4 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-sm text-gray-600">
            Upload an .xlsx file with columns: <strong>Name</strong>, Description, <strong>Category</strong>{" "}
            (must match an existing category name), <strong>Price (₹)</strong>, Compare-at Price (₹), Weight /
            Variant, <strong>Stock Quantity</strong>, Image URL.
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-xs font-medium text-zumbii-700 bg-white border border-zumbii-200 rounded-lg hover:bg-zumbii-50 transition-colors"
          >
            <Download size={14} />
            Template
          </button>
        </div>

        {parseError && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}

        {!results && (
          <label
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
              parsing
                ? "border-gray-200 bg-gray-50 cursor-wait"
                : "border-gray-300 hover:border-zumbii-400 hover:bg-zumbii-50/40"
            }`}
          >
            {parsing ? (
              <Loader2 size={22} className="animate-spin text-zumbii-500" />
            ) : (
              <FileSpreadsheet size={22} className="text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {fileName || "Click to select an .xlsx file"}
            </span>
            <span className="text-xs text-gray-400">or drag and drop</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={parsing}
              onChange={handleFileSelect}
            />
          </label>
        )}

        {rows.length > 0 && !results && (
          <>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 size={15} />
                {validCount} ready to import
              </span>
              {errorCount > 0 && (
                <span className="flex items-center gap-1.5 text-red-600 font-medium">
                  <XCircle size={15} />
                  {errorCount} row{errorCount === 1 ? "" : "s"} with errors (won&apos;t be imported)
                </span>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Row</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Name</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Price</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Stock</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.rowNumber} className="border-b border-gray-50">
                        <td className="py-1.5 px-3 text-gray-400">{r.rowNumber}</td>
                        <td className="py-1.5 px-3 text-gray-800">{r.name || "—"}</td>
                        <td className="py-1.5 px-3 text-gray-600">{r.categoryName || "—"}</td>
                        <td className="py-1.5 px-3 text-gray-600">{r.price || "—"}</td>
                        <td className="py-1.5 px-3 text-gray-600">{r.quantity || "—"}</td>
                        <td className="py-1.5 px-3">
                          {r.error ? (
                            <span className="text-red-600">{r.error}</span>
                          ) : (
                            <span className="text-emerald-600">Ready</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {results && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 px-4 py-3">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium text-sm">
                <CheckCircle2 size={16} />
                {results.created} created
              </span>
              {results.failed > 0 && (
                <span className="flex items-center gap-1.5 text-red-600 font-medium text-sm">
                  <XCircle size={16} />
                  {results.failed} failed
                </span>
              )}
            </div>
            {results.errors.length > 0 && (
              <div className="border border-red-100 bg-red-50 rounded-lg px-4 py-3 space-y-1 max-h-40 overflow-y-auto">
                {results.errors.map((e) => (
                  <p key={e.row} className="text-xs text-red-700">
                    Row {e.row}: {e.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {results ? "Close" : "Cancel"}
          </button>
          {!results && (
            <button
              type="button"
              onClick={handleImport}
              disabled={validCount === 0 || submitting || parsing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-600 rounded-lg hover:bg-zumbii-700 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Import {validCount > 0 ? `${validCount} Product${validCount === 1 ? "" : "s"}` : ""}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
