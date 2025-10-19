const LogoLoader = () => (
  <div className="flex flex-col items-center justify-center space-y-6">
    {/* Animated Logo */}
    <div className="relative">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse shadow-lg"></div>
      <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-ping"></div>
    </div>
    
    {/* App Name */}
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold text-foreground animate-pulse">Callytics</h1>
      <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
    </div>
  </div>
)

const CreativeSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  </div>
)

const LoadingDots = () => (
  <div className="flex items-center justify-center space-x-1">
    <div className="h-1 w-1 bg-primary rounded-full animate-pulse"></div>
    <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
)

export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto px-4">
        {/* Logo and Brand */}
        <LogoLoader />
        
        {/* Creative Loading Animation */}
        <div className="flex flex-col items-center space-y-4">
          <CreativeSpinner />
          <LoadingDots />
        </div>
        
        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your analytics dashboard
          </p>
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
