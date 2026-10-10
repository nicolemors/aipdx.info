import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import type { BlockWithChildren } from "@/lib/notion/client";

// Minimal renderer covering the block types AI Portland's Stories content
// actually uses (text, headings, lists, images, quotes, callouts, code,
// dividers, side-by-side columns). Deliberately restyles everything to the
// site's own visual language (pink accent, surface cards) rather than
// mirroring Notion's own colors/icons, so content built in Notion looks
// native to the site regardless of what an editor picks there.

function RichText({ richText }: { richText: RichTextItemResponse[] }) {
  return (
    <>
      {richText.map((segment, i) => {
        let node: React.ReactNode = segment.plain_text;
        if (segment.annotations.code) node = <code key="code">{node}</code>;
        if (segment.annotations.bold) node = <strong key="bold">{node}</strong>;
        if (segment.annotations.italic) node = <em key="italic">{node}</em>;
        if (segment.annotations.strikethrough) node = <s key="strike">{node}</s>;

        const href = segment.type === "text" ? segment.text.link?.url : undefined;
        if (href) {
          node = (
            <a
              key="link"
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-pink underline decoration-pink/40 underline-offset-2 hover:decoration-pink"
            >
              {node}
            </a>
          );
        } else if (segment.type === "text" && segment.plain_text.includes("Idealist Consulting")) {
          const target = "Idealist Consulting";
          const text = segment.plain_text;
          const matchIndex = text.toLowerCase().indexOf(target.toLowerCase());

          if (matchIndex >= 0) {
            const before = text.slice(0, matchIndex);
            const match = text.slice(matchIndex, matchIndex + target.length);
            const after = text.slice(matchIndex + target.length);
            node = (
              <>
                {before}
                <a
                  href="https://idealistconsulting.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink underline decoration-pink/40 underline-offset-2 hover:decoration-pink"
                >
                  {match}
                </a>
                {after}
              </>
            );
          }
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function groupListItems(blocks: BlockWithChildren[]) {
  const groups: (BlockWithChildren | BlockWithChildren[])[] = [];
  for (const block of blocks) {
    const last = groups[groups.length - 1];
    if (
      (block.type === "bulleted_list_item" || block.type === "numbered_list_item") &&
      Array.isArray(last) &&
      last[0].type === block.type
    ) {
      last.push(block);
    } else if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      groups.push([block]);
    } else {
      groups.push(block);
    }
  }
  return groups;
}

function Block({ block, inColumn = false }: { block: BlockWithChildren; inColumn?: boolean }) {
  switch (block.type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) return null;
      return (
        <p className="leading-relaxed text-paper/80">
          <RichText richText={block.paragraph.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className="mt-10 text-2xl font-bold text-paper">
          <RichText richText={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-8 text-xl font-bold text-paper">
          <RichText richText={block.heading_2.rich_text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-6 text-lg font-semibold text-paper">
          <RichText richText={block.heading_3.rich_text} />
        </h4>
      );
    case "quote":
      return (
        <blockquote className="whitespace-pre-line border-l-4 border-pink bg-paper/[0.02] py-2 pl-6 text-xl font-bold italic text-pink">
          <RichText richText={block.quote.rich_text} />
        </blockquote>
      );
    case "callout": {
      // Deliberately ignores Notion's own `color` and `icon` fields —
      // callouts should look like the rest of the site (pink accent, surface
      // card), not whatever color/emoji an editor happened to pick in Notion.
      const children = block.children ?? [];
      return (
        <div className="space-y-2 rounded-2xl border border-pink/30 bg-surface p-6">
          <p className="leading-relaxed text-paper/80">
            <RichText richText={block.callout.rich_text} />
          </p>
          {children.map((child) => (
            <Block key={child.id} block={child} />
          ))}
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 text-sm text-paper/80">
          <code>
            <RichText richText={block.code.rich_text} />
          </code>
        </pre>
      );
    case "divider":
      return <hr className="border-paper/10" />;
    case "image": {
      const src = block.image.type === "external" ? block.image.external.url : block.image.file.url;
      const caption = block.image.caption.length > 0 ? block.image.caption : undefined;

      // Inside a column, an image is a photo meant to fill its half of the
      // layout — crop it to fill like the rest of the site's photo cards.
      if (inColumn) {
        return (
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image src={src} alt="" fill sizes="(min-width: 640px) 350px, 100vw" className="object-cover" />
            </div>
            {caption && (
              <figcaption className="mt-2 text-center text-sm text-muted">
                <RichText richText={caption} />
              </figcaption>
            )}
          </figure>
        );
      }

      // A logo (e.g. a partner mention embedded in a story) shouldn't be
      // force-cropped like a photo — contain it in a small white card,
      // matching the treatment partner/sponsor logos get elsewhere on the
      // site, and link it out like those do too.
      if (src.includes("IC_FullMark_Horizontal_FullColor.png")) {
        return (
          <figure className="mx-auto flex w-fit flex-col items-center gap-2">
            <a href="https://idealistconsulting.com/" target="_blank" rel="noreferrer">
              <div className="flex h-24 w-56 items-center justify-center rounded-xl bg-paper p-4">
                <div className="relative h-full w-full">
                  <Image src={src} alt="Idealist Consulting" fill sizes="224px" className="object-contain" />
                </div>
              </div>
            </a>
            {caption && (
              <figcaption className="text-center text-sm text-muted">
                <RichText richText={caption} />
              </figcaption>
            )}
          </figure>
        );
      }

      // Standalone photo — let it fill the full available content width rather
      // than being restricted to a narrow, centered tile.
      return (
        <figure className="flex w-full flex-col items-center gap-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-muted">
              <RichText richText={caption} />
            </figcaption>
          )}
        </figure>
      );
    }
    case "column_list": {
      const columns = block.children ?? [];
      const columnClass = columns.length > 2 ? "sm:grid-cols-3" : columns.length > 1 ? "sm:grid-cols-2" : "";
      return (
        <div className={`grid gap-8 sm:items-center ${columnClass}`}>
          {columns.map((column) => (
            <NotionBlocks key={column.id} blocks={column.children ?? []} inColumn />
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

export function NotionBlocks({ blocks, inColumn = false }: { blocks: BlockWithChildren[]; inColumn?: boolean }) {
  const groups = groupListItems(blocks);

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        if (Array.isArray(group)) {
          const ListTag = group[0].type === "numbered_list_item" ? "ol" : "ul";
          return (
            <ListTag key={group[0].id} className="list-disc space-y-2 pl-6 text-paper/80 marker:text-pink">
              {group.map((item) => (
                <li key={item.id}>
                  <RichText
                    richText={
                      item.type === "bulleted_list_item"
                        ? item.bulleted_list_item.rich_text
                        : item.type === "numbered_list_item"
                          ? item.numbered_list_item.rich_text
                          : []
                    }
                  />
                </li>
              ))}
            </ListTag>
          );
        }
        return <Block key={group.id} block={group} inColumn={inColumn} />;
      })}
    </div>
  );
}
