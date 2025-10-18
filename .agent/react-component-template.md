```tsx
"use client";

import type { FC } from "react";

interface ButtonProps {
  title: string;
  onClick: () => void;
}

export const Button: FC<Props> = ({ title, onClick }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
```
