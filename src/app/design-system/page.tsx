import type {Metadata} from "next";
import {EHScope} from "@/design-system";
import {DesignShowcase} from "./showcase";
export const metadata: Metadata = {title: "Einfachhausen · Designsystem 1.0", robots: {index:false,follow:false}};
export default function DesignSystemPage() {return <EHScope><DesignShowcase/></EHScope>;}
