import { getHomeCTAContent } from "@/lib/home";
import CTAClient from "./CTAClient";

const CTA = async () => {
  const [contentEn, contentKa] = await Promise.all([
    getHomeCTAContent("en"),
    getHomeCTAContent("ka"),
  ]);

  return <CTAClient contentEn={contentEn} contentKa={contentKa} />;
};

export default CTA;
