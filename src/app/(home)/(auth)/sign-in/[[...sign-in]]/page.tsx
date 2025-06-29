"use client";

import { SignIn } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const theme = useCurrentTheme();
  
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                cardBox: "rounded-lg! border! shadow-none!",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
