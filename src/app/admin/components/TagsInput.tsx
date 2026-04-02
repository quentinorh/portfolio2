"use client";

const AVAILABLE_TAGS = [
  "Fabrication",
  "Environnement",
  "Photographie",
  "Programmation",
  "Graphisme",
];

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const isChecked = (tag: string) =>
    value.some((v) => v.toLowerCase() === tag.toLowerCase());

  const toggle = (tag: string) => {
    if (isChecked(tag)) {
      onChange(value.filter((v) => v.toLowerCase() !== tag.toLowerCase()));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TAGS.map((tag) => (
          <label
            key={tag}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors select-none ${
              isChecked(tag)
                ? "bg-[#219CB8]/10 border-[#219CB8] text-[#219CB8]"
                : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked(tag)}
              onChange={() => toggle(tag)}
              className="sr-only"
            />
            {isChecked(tag) && (
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {tag}
          </label>
        ))}
      </div>
    </div>
  );
}
