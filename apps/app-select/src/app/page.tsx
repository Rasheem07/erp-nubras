"use client";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  FileText,
  DollarSign,
  ShoppingCart,
  Users,
  Settings,
  Box,
  UserCheck,
  HardHat,
} from "lucide-react";

const MODULES = [
  { name: "Finance", sub: "finance", Icon: DollarSign },
  { name: "POS", sub: "pos", Icon: ShoppingCart },
  { name: "CRM", sub: "crm", Icon: Users },
  { name: "Inventory", sub: "inventory", Icon: Box },
  { name: "HR", sub: "hr", Icon: UserCheck },
  { name: "Manufacturing", sub: "manufacturing", Icon: HardHat },
  { name: "System", sub: "system", Icon: Settings },
  { name: "Docs", sub: "an-sitedocs", Icon: FileText },
];

const Home: NextPage = () => (
  <>
    <Head>
      <title>Al Nubras ERP • Select Module</title>
      <meta name="description" content="Select your ERP module" />
    </Head>

    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#D9DDDC" /* Pearl River */ }}
    >
      <h1
        className="text-4xl uppercase md:text-5xl font-bold mb-6"
        style={{ color: "#3E424B" /* Anchor */ }}
      >
        Al Nubras ERP
      </h1>
      <p
        className="text-center max-w-lg mb-16 leading-relaxed"
        style={{ color: "#48494B" /* Iron */ }}
      >
        Choose the app you need. Each will open in a new window so you can
        keep this selector handy.
      </p>

      <div className="grid gap-8 w-full max-w-5xl sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map(({ name, sub, Icon }) => (
          <Link
            key={sub}
            href={`https://${sub}.alnubras.co`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              flex flex-col items-center justify-center
              rounded-xl p-10
              border border-[#877F7D]                    /* Stone */
              bg-gradient-to-br from-[#D6CFC7] to-[#C7C6C1] /* Abalone→HarborGray */
              transform transition
              hover:scale-105
              hover:from-[#C7C6C1] hover:to-[#BEBDB8]     /* HarborGray→Smoke */
              hover:border-[#88807B]                     /* Mink */
            "
          >
            <Icon
              className="h-8 w-8 text-[#48494B] group-hover:text-[#3E424B]" /* Iron → Anchor */
            />
            <span className="mt-2 text-lg font-medium text-[#3E424B]">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </main>
  </>
);

export default Home;
