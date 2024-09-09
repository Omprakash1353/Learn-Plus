import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar role="admin" className="mt-[66px] hidden lg:flex" />
      <div className="lg:pl-[256px]">{children}</div>
    </>
  );
}
