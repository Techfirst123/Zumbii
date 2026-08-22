"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type { VariantOptionType } from "@/types";

interface VariantSelectorProps {
  variantOptions: VariantOptionType[];
  selected: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
  isValueAvailable?: (optionName: string, value: string) => boolean;
}

export function VariantSelector({
  variantOptions,
  selected,
  onSelect,
  isValueAvailable,
}: VariantSelectorProps) {
  if (variantOptions.length === 0) return null;

  return (
    <div className="space-y-4">
      {variantOptions.map((option) => {
        const isColorLike = option.values.some((v) => v.swatch);
        return (
          <div key={option.name}>
            <p className="text-sm font-medium text-text-primary mb-2">
              {option.name}
              {selected[option.name] && (
                <span className="text-text-secondary font-normal">: {selected[option.name]}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {option.values.map((value) => {
                const isSelected = selected[option.name] === value.label;
                const available = isValueAvailable ? isValueAvailable(option.name, value.label) : true;

                if (isColorLike && value.swatch) {
                  return (
                    <button
                      key={value.label}
                      type="button"
                      title={value.label}
                      disabled={!available}
                      onClick={() => onSelect(option.name, value.label)}
                      className={clsx(
                        "relative w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center",
                        isSelected ? "border-zumbii-500 scale-110" : "border-border hover:border-zumbii-300",
                        !available && "opacity-30 cursor-not-allowed"
                      )}
                      style={{ backgroundColor: value.swatch }}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className={clsx(
                            "drop-shadow",
                            isLightColor(value.swatch) ? "text-black/70" : "text-white"
                          )}
                        />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={value.label}
                    type="button"
                    disabled={!available}
                    onClick={() => onSelect(option.name, value.label)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                      isSelected
                        ? "bg-zumbii-600 border-zumbii-600 text-white"
                        : "bg-surface border-border text-text-secondary hover:border-zumbii-400 hover:text-zumbii-600",
                      !available && "opacity-40 cursor-not-allowed line-through"
                    )}
                  >
                    {value.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
