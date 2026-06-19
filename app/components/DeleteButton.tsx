"use client"

export default function DeleteButton() {
    return (
        <button
        type="submit"
        onClick={(e) => {
            if (!window.confirm("Are you sure you want to delete this member?")) {
                e.preventDefault();
            }
        }}
      className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
    >
      dont click
    </button>
  );
}