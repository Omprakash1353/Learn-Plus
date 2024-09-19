import Image from "next/image";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { validateRequest } from "@/lib/lucia";
import { ProfileForm } from "./_components/profile-form";

export default async function UserProfile() {
  const { user } = await validateRequest();
  if (!user) return redirect("/");

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-full overflow-hidden rounded-lg border-none shadow-none outline-none">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <Image
            src="/user-profile.png"
            width={350}
            height={500}
            alt="Profile background"
            className="absolute bottom-0 right-0 h-auto w-64 object-contain"
          />
        </div>
        <ProfileForm />
      </Card>
    </div>
  );
}
