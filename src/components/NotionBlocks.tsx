import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";

// Minimal renderer covering the block types AI Portland's Stories content
// actually uses (text, headings, lists, images, quotes, code, dividers).
// Nested/children blocks (e.g. a list item with a sub-list) are not
// rendered — flagging this as a judgment call, not a spec requirement,
// since recap posts are expected to be simple prose + images.

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
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function groupListItems(blocks: BlockObjectResponse[]) {
  const groups: (BlockObjectResponse | BlockObjectResponse[])[] = [];
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

function Block({ block }: { block: BlockObjectResponse }) {
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
      // Deliberately ignores Notion's own `color` field — callouts should
      // look like the rest of the site (pink accent, surface card), not
      // whatever background color an editor happened to pick in Notion.
      const icon = block.callout.icon;
      const emoji = icon?.type === "emoji" ? icon.emoji : null;
      return (
        <div className="flex gap-4 rounded-2xl border border-pink/30 bg-surface p-6">
          {emoji && (
            <span aria-hidden className="text-2xl leading-none">
              {emoji}
            </span>
          )}
          <p className="leading-relaxed text-paper/80">
            <RichText richText={block.callout.rich_text} />
          </p>
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
      return (
        <figure>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={src} alt="" fill sizes="(min-width: 768px) 700px, 100vw" className="object-cover" />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted">
              <RichText richText={caption} />
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      return null;
  }
}

export function NotionBlocks({ blocks }: { blocks: BlockObjectResponse[] }) {
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
        return <Block key={group.id} block={group} />;
      })}
    </div>
  );
}
