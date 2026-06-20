"use client";

import Barcode from "react-barcode";

export default function MemberBarcode({
  value,
}: {
  value: string;
}) {
  return (
    <Barcode
      value={value}
      height={60}
      width={1.5}
      margin={0}
      displayValue={false}
    />
  );
}