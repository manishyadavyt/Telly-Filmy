export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <img
        src="/logo.png"
        alt="Telly Filmy Logo"
        className="h-20 w-20.5 object-contain" // ⬅️ Increased size
      />
      {/* <span className="text-xl font-bold text-foreground">
        Telly Filmy
      </span> */}
    </div>
  );
}
