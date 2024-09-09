import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  SignInTab: React.ReactNode;
  SignUpTab: React.ReactNode;
};

export function AuthTabSwitcher(props: Props) {
  return (
    <Tabs defaultValue="sign-in" className="w-[400px] flex justify-center items-center flex-col">
      <TabsList className="grid w-full grid-cols-2 text-black">
        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">{props.SignInTab}</TabsContent>
      <TabsContent value="sign-up">{props.SignUpTab}</TabsContent>
    </Tabs>
  );
}
