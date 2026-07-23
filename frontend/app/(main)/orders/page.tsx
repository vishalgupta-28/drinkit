import Link from "next/link";

export default function OrdersPage() {
  const orders = [
    { id: "ord_1029", items: 3, total: 2400, status: "Out for delivery" },
    { id: "ord_1004", items: 1, total: 1200, status: "Delivered" },
  ];
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-extrabold">Your Orders</h1>
      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/orders/${o.id}/track`}
          className="flex items-center justify-between rounded bg-card p-4 shadow-sm"
        >
          <div>
            <p className="font-semibold">#{o.id}</p>
            <p className="text-xs text-muted">{o.items} items · ₹{o.total}</p>
          </div>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
            {o.status}
          </span>
        </Link>
      ))}
    </div>
  );
}
