import { AuthTabSwitcher } from "./_components/auth-tab-switcher";
import { SignInForm } from "./_components/sign-in-form";
import { SignUpForm } from "./_components/sign-up-form";

export default function Authentication() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center blur-[60px]">
        <div
          className="to-primary-muted animate-slide-1 absolute left-1/2 top-[-25%] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-900 opacity-30 blur-3xl sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            filter: "blur(20px)",
          }}
        ></div>
        <div
          className="animate-slide-2 absolute bottom-0 left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-900 to-green-900 opacity-30 blur-3xl sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            filter: "blur(20px)",
          }}
        ></div>
      </div>
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <AuthTabSwitcher
          SignInTab={<SignInForm />}
          SignUpTab={<SignUpForm />}
        />
      </div>
    </div>
  );
}
