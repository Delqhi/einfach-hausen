"use client";

import Image from "next/image";
import {
  Apple,
  ExternalLink,
  Monitor,
  Smartphone,
  Globe2,
} from "lucide-react";

type GetStartedBlockProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage: string;
  webImage: string;
  macHref?: string;
  windowsHref?: string;
  appStoreHref?: string;
  playStoreHref?: string;
  webHref?: string;
};

/**
 * GetStartedBlock — Download-Zugang Sektion (Operator-Vorgabe):
 * Desktop / Mobile / Web Version als gleichwertige Karten.
 * "Web App öffnen" statt Extension-Zahlen.
 */
export function GetStartedBlock({
  className = "",
  title = "Einfach loslegen",
  subtitle = "Nutze einfach-hausen auf deinem Computer, Smartphone oder direkt im Browser.",
  desktopImage,
  mobileImage,
  webImage,
  macHref = "#",
  windowsHref = "#",
  appStoreHref = "#",
  playStoreHref = "#",
  webHref = "/app",
}: GetStartedBlockProps) {
  return (
    <section
      className={[
        "bg-white px-5 py-20 sm:px-8 lg:py-28",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-[34px] font-semibold tracking-[-0.035em] text-neutral-950 sm:text-[42px]">
            {title}
          </h2>
          <p className="mt-4 text-[16px] leading-7 text-neutral-500 sm:text-[18px]">
            {subtitle}
          </p>
        </div>
        {/* Cards */}
        <div className="mt-16 grid items-stretch gap-5 lg:mt-24 lg:grid-cols-3">
          {/* Desktop */}
          <article className="flex min-h-[590px] flex-col overflow-hidden rounded-[20px] border border-black/[0.10] bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={desktopImage}
                alt="Desktop App"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100">
                  <Monitor className="h-5 w-5" />
                </div>
                <h3 className="text-[25px] font-semibold tracking-[-0.03em] text-neutral-950">
                  Desktop App
                </h3>
              </div>
              <p className="text-[15px] leading-6 text-neutral-500">
                Erlebe die volle Plattform direkt auf deinem Computer – schnell und mit allem, was du brauchst.
              </p>
              <div className="mt-auto space-y-3 pt-10">
                <a
                  href={macHref}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-[14px] font-medium text-white transition hover:bg-neutral-800"
                >
                  <Apple className="h-4 w-4" />
                  Download für Mac
                </a>
                <a
                  href={windowsHref}
                  className="flex h-12 items-center justify-center rounded-xl border border-black/[0.10] bg-white px-5 text-[14px] font-medium text-neutral-950 transition hover:bg-neutral-50"
                >
                  Download für Windows
                </a>
              </div>
            </div>
          </article>
          {/* Mobile */}
          <article className="flex min-h-[590px] flex-col overflow-hidden rounded-[20px] border border-black/[0.10] bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={mobileImage}
                alt="Mobile App"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-[25px] font-semibold tracking-[-0.03em] text-neutral-950">
                  Mobile App
                </h3>
              </div>
              <p className="text-[15px] leading-6 text-neutral-500">
                Nimm einfach-hausen überall mit: alle wichtigen Funktionen und Infos auf deinem Smartphone.
              </p>
              <div className="mt-auto pt-10">
                <p className="mb-3 text-[13px] font-medium text-neutral-900">
                  Verfügbar in deinen App-Stores:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={appStoreHref}
                    className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-black/[0.10] px-4 text-center transition hover:bg-neutral-50"
                  >
                    <Apple className="mb-2 h-7 w-7" />
                    <span className="text-[11px] text-neutral-500">
                      Laden im
                    </span>
                    <span className="mt-0.5 text-[14px] font-semibold">
                      App Store
                    </span>
                  </a>
                  <a
                    href={playStoreHref}
                    className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-black/[0.10] px-4 text-center transition hover:bg-neutral-50"
                  >
                    <div className="mb-2 grid h-7 w-7 place-items-center rounded-md bg-neutral-950 text-[10px] font-bold text-white">
                      ▶
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      Jetzt bei
                    </span>
                    <span className="mt-0.5 text-[14px] font-semibold">
                      Google Play
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </article>
          {/* Web Version */}
          <article className="flex min-h-[590px] flex-col overflow-hidden rounded-[20px] border border-black/[0.10] bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={webImage}
                alt="Web Version"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="text-[25px] font-semibold tracking-[-0.03em] text-neutral-950">
                  Web Version
                </h3>
              </div>
              <p className="text-[15px] leading-6 text-neutral-500">
                Nutze die komplette Plattform direkt im Browser. Keine Installation nötig — einfach anmelden und loslegen.
              </p>
              <div className="mt-auto pt-10">
                <div className="mb-4 rounded-xl border border-black/[0.08] bg-neutral-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm">
                      <Globe2 className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-neutral-950">
                        Überall verfügbar
                      </div>
                      <div className="mt-0.5 text-[12px] text-neutral-500">
                        Chrome, Safari, Firefox &amp; mehr
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  href={webHref}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-[14px] font-medium text-white transition hover:bg-neutral-800"
                >
                  Web App öffnen
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default GetStartedBlock;
