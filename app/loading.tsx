export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">π</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gradient-pi">Loading...</p>
          <p className="text-xs text-muted-foreground">Powered by Pi Network</p>
        </div>
      </div>
    </div>
  )
}
