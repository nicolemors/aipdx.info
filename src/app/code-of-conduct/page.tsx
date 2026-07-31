import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { codeOfConduct } from "@/content/site";

export const metadata: Metadata = {
  title: "Code of Conduct | AI Portland",
};

export default function CodeOfConductPage() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl">
        <h1 className="text-4xl font-bold text-paper">Code of Conduct</h1>
        <p className="mt-6 leading-relaxed text-paper/75">{codeOfConduct.body}</p>
      </Container>
    </section>
  );
}
