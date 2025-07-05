export default function UserStatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow text-center border border-gray-700">
      <h3 className="text-sm text-gray-400">{label}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}