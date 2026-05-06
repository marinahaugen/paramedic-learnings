import { notFound } from "next/navigation";
import { CreateSourceForm, type SourceFormType } from "./create-source-form";

const VALID_TYPES = ["debrief", "research"] as const satisfies readonly SourceFormType[];

function isValidType(value: string): value is SourceFormType {
  return (VALID_TYPES as readonly string[]).includes(value);
}

export default async function NewSourcePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isValidType(type)) notFound();
  return <CreateSourceForm type={type} />;
}
