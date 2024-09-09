import { EmblaTestimonials } from "@/components/custom/testimonial";
import { Icons } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./form";
import { CheckCircle, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Home() {
  return (
    <>
      <div className="mt-24" />
      <div className="flex min-h-screen flex-col overflow-hidden">
        <main className="flex h-auto w-full flex-grow flex-col items-center justify-center gap-10 px-5">
          <section className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center gap-5 px-6 text-center md:px-8">
            {/* Intro Learn Plus */}
            <div className="intro-label flex items-center justify-center shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40">
              <div className="absolute inset-0 block h-full w-full px-10"></div>
              <span role="img" aria-label="celebration">
                🎉
              </span>
              <hr className="mx-2 h-4 w-[1px] shrink-0 bg-foreground" />
              <span className="text-gradient whitespace-nowrap">
                Introducing Learn Plus
              </span>
            </div>

            <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl">
              Master skills and advance
              <br className="hidden md:block" /> your education.
            </h1>

            <p className="animate-fade-in mb-6 -translate-y-4 text-balance text-lg tracking-tight text-gray-700 [--animation-delay:400ms] dark:text-gray-400 md:text-xl">
              Beautifully designed, learner-focused, and packed with powerful
              features.
              <br className="hidden md:block" /> We care about your growth, not
              just your progress.
            </p>

            <Link href={"/courses"}>
              <Button size={"lg"} className="group z-30 mb-10">
                Explore Now
                <Icons.rightArrow className="ml-2 h-5 w-5 transform transition duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="relative flex items-center justify-center">
              <div className="line-animation line-animation-active bg-line-light dark:bg-line-dark z-10 flex items-center justify-center rounded-[10px] p-[3px]">
                <Image
                  className="z-10 rounded-xl duration-200 transition-all"
                  src="/image.png"
                  alt="Temp Image"
                  width={1100}
                  height={604.2}
                  sizes="100vw"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-40 -z-10 h-[800px] w-[150%] bg-radial-light dark:bg-radial-dark"></div>
            </div>
          </section>

          <section className="relative mx-auto my-10 flex max-w-[86rem] flex-col items-center justify-center gap-5 px-6 text-center md:px-8">
            <div className="flex items-center justify-between gap-20">
              <div className="text-start">
                <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-center text-5xl font-semibold leading-none text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-5xl">
                  Our Students Are{" "}
                  <span className="animate-colorChange">Our Strength</span> See
                  What They Say About Us
                </h1>
                <span className="relative tracking-wider before:absolute before:-left-4 before:text-2xl before:content-['“'] after:absolute after:-right-4 after:text-2xl after:content-['”']">
                  Our students are at the heart of everything we do, and their
                  success is our greatest achievement. <br />
                  We take immense pride in their accomplishments and value their
                  voices in shaping our journey.
                </span>
              </div>
              <div className="relative flex h-[400px] w-[400px] flex-shrink-0 items-center justify-center">
                <Image
                  src="/review.webp"
                  alt="Review"
                  height={350}
                  width={350}
                  className="z-10 rounded-full"
                />
                <div className="img-testimonial absolute left-0 right-0 top-0 z-0 backdrop-blur-md"></div>
              </div>
            </div>
            <div className="w-full">
              <EmblaTestimonials />
            </div>
          </section>

          <section className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center gap-5 px-6 text-center md:px-8">
            <h2 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-5xl">
              Worry about your skill, not your bill.
            </h2>
            <p className="animate-fade-in mb-6 -translate-y-4 text-balance text-lg tracking-tight text-gray-700 [--animation-delay:400ms] dark:text-gray-400 md:text-xl">
              We wanted pricing to be as simple as possible. No calculator
              needed.
            </p>
            <div className="grid h-auto w-[80rem] grid-cols-3 items-center justify-center gap-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card className="h-auto w-full p-5" key={i}>
                  <CardHeader>
                    <h3 className="text-start text-lg">Person Plan</h3>
                    <div className="flex items-center text-start">
                      <User className="h-4 w-4" />{" "}
                      <span className="text-sm">Individual</span>
                    </div>
                    <br />
                    <div className="my-1 text-start">
                      <p className="text-sm">
                        <span className="font-semibold">
                          Starting at $850.00 per month.{" "}
                        </span>
                        <br /> Billed monthly or annually.
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Link href={"/"}>
                      <Button
                        size={"lg"}
                        className="group z-30 my-2 mb-10 w-full text-lg"
                      >
                        Get Started
                        <Icons.rightArrow className="ml-2 h-5 w-5 transform transition duration-300 ease-in-out group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <ul className="mt-4 divide-y-8 divide-transparent text-start text-sm">
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>Access to 11,000+ top courses</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>Certification prep</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>Goal-focused recommendations</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>AI-powered coding exercises</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>Certification prep</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>Goal-focused recommendations</span>
                      </li>
                      <li>
                        <CheckCircle className="mr-4 inline-block h-6 w-6 rounded-full p-[2px] text-green-500" />{" "}
                        <span>AI-powered coding exercises</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="relative mx-auto my-20 flex max-w-7xl flex-col items-center justify-center gap-10 px-6 text-center md:px-8">
            <div className="h-auto w-full">
              {" "}
              <h2 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-[800px]">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that matches the other
                    components&apos; aesthetic.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it
                    if you prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <br />
            <div className="h-auto w-full">
              <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-0 text-4xl font-semibold leading-none text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-4xl">
                Didn&apos;t find an answer ?
              </h1>
              <p className="animate-fade-in mb-6 -translate-y-4 text-balance text-lg text-gray-700 [--animation-delay:400ms] dark:text-gray-400 md:text-xl">
                Our team is just an email away and ready to answer your
                questions
              </p>
              <div className="flex items-center justify-center gap-36">
                <ContactForm />
                <Image
                  src={"/contact-us-mail.png"}
                  alt="Contact Us"
                  height={400}
                  width={400}
                  className="rounded-md"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
