import type { Metadata } from "next";
import { ProfileForm } from "@/feature/account/components/profile-form";

export const metadata: Metadata = {
  title: "Account — ArtiSun",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <ProfileForm />
    </div>
  );
}
