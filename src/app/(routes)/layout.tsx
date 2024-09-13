import { Footer } from "@/components/footer";
import { Header } from "@/components/navbar";
import { validateRequest } from "@/lib/lucia";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mb-[66px]" />
      <main className="flex-grow min-h-full">{children}</main>
      <div className="mt-16" />
      <Footer />
    </div>
  );
}
