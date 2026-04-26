export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute h-8 w-8 rounded-full border-4 border-primary/10 border-b-primary animate-spin-reverse" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري تحميل البيانات...</p>
    </div>
  );
}
