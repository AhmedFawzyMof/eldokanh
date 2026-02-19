export default function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-3xl p-4 shadow-sm animate-pulse"
        >
          <div className="aspect-square mb-4 rounded-2xl bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-1/4 bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-1/3 bg-muted rounded" />
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
