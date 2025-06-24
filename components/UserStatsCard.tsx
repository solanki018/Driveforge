export default function UserStatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
