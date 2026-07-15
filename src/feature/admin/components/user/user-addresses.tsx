import type { UserAddress } from "@/feature/admin/components/user/types";

export function UserAddresses({ addresses }: { addresses: UserAddress[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-[#1a1a1a]">Addresses</h2>
      {addresses.length === 0 ? (
        <p className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-6 py-8 text-center text-sm text-[#707065]">
          No saved addresses.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-[#e5e5e0] bg-white px-4 py-4 text-sm text-[#4a4a40]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-[#1a1a1a]">{addr.fullName}</div>
                {addr.isDefault && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#707065]">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-1 text-[#707065]">{addr.phone}</div>
              <div className="mt-2 leading-relaxed">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}
                <br />
                {addr.city}, {addr.state} {addr.pincode}
                <br />
                {addr.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
