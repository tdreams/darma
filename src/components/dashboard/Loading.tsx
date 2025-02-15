export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-blue-500 bg-opacity-25 rounded-xl p-4 animate-pulse"
        >
          <div className="h-6 bg-blue-400 rounded w-24 mb-2" />
          <div className="h-8 bg-blue-400 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
