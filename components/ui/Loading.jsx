// components/ui/Loading.js

export function LoadingSpinner({ size = "sm", className = "" }) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingButton({ loading, children, className = "", ...props }) {
  return (
    <button 
      className={`professional-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

export function LoadingCard({ message = "Loading..." }) {
  return (
    <div className="professional-card p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingOverlay({ message = "Processing your request..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="professional-card p-8 text-center max-w-sm mx-4">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-foreground font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}