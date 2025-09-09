import { Blocks, MoveRight, Wrench, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const Hero25 = ({ className }: { className?: string }) => {
  return (
    <section className={cn("py-20 md:py-28 lg:py-36", className)}>
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-4.svg"
            alt="placeholder"
            className="mx-auto mb-6 w-14 md:mb-8 md:w-20 lg:mb-10 lg:w-24"
          />
          <span className="mb-2 inline-block text-sm font-medium tracking-wider text-muted-foreground uppercase md:text-base">
            SYSTEMS
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-7xl lg:leading-[1.1]">
            A system crafted for team success and growth
          </h1>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8 py-6 text-base font-medium">
              Get started
              <MoveRight className="ml-2 size-5" strokeWidth={1.5} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-base font-medium"
            >
              Read the docs
              <MoveRight className="ml-2 size-5" strokeWidth={1.5} />
            </Button>
          </div>
          <div className="mt-10 lg:mt-12">
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground lg:text-base">
              <li className="flex items-center gap-2.5 whitespace-nowrap">
                <Zap className="size-5 text-primary" />
                Quick setup guide
              </li>
              <li className="flex items-center gap-2.5 whitespace-nowrap">
                <Blocks className="size-5 text-primary" />
                Fully customizable
              </li>
              <li className="flex items-center gap-2.5 whitespace-nowrap">
                <Wrench className="size-5 text-primary" />
                Easy to use components
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero25 };
