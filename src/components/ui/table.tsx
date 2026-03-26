import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

export const tableVariants = tv({
  slots: {
    root: "w-full overflow-auto",
    table: "w-full caption-bottom text-sm font-mono",
    header: "[&_tr]:border-b border-border-primary",
    body: "[&_tr:last-child]:border-0",
    footer:
      "border-t border-border-primary bg-bg-surface/50 font-medium [&>tr]:last:border-b-0",
    row: "border-b border-border-primary transition-colors hover:bg-bg-surface/50 data-[state=selected]:bg-bg-surface",
    head: "h-10 px-5 text-left align-middle font-medium text-text-tertiary [&:has([role=checkbox])]:pr-0",
    cell: "p-5 align-middle [&:has([role=checkbox])]:pr-0",
    caption: "mt-4 text-sm text-text-tertiary",
  },
});

export const Table = forwardRef<HTMLTableElement, ComponentProps<"table">>(
  ({ className, ...props }, ref) => {
    const { root, table } = tableVariants();
    return (
      <div className={root()}>
        <table ref={ref} className={table({ className })} {...props} />
      </div>
    );
  },
);
Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  ComponentProps<"thead">
>(({ className, ...props }, ref) => {
  const { header } = tableVariants();
  return <thead ref={ref} className={header({ className })} {...props} />;
});
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  ComponentProps<"tbody">
>(({ className, ...props }, ref) => {
  const { body } = tableVariants();
  return <tbody ref={ref} className={body({ className })} {...props} />;
});
TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  ComponentProps<"tfoot">
>(({ className, ...props }, ref) => {
  const { footer } = tableVariants();
  return <tfoot ref={ref} className={footer({ className })} {...props} />;
});
TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef<HTMLTableRowElement, ComponentProps<"tr">>(
  ({ className, ...props }, ref) => {
    const { row } = tableVariants();
    return <tr ref={ref} className={row({ className })} {...props} />;
  },
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, ComponentProps<"th">>(
  ({ className, ...props }, ref) => {
    const { head } = tableVariants();
    return <th ref={ref} className={head({ className })} {...props} />;
  },
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, ComponentProps<"td">>(
  ({ className, ...props }, ref) => {
    const { cell } = tableVariants();
    return <td ref={ref} className={cell({ className })} {...props} />;
  },
);
TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  ComponentProps<"caption">
>(({ className, ...props }, ref) => {
  const { caption } = tableVariants();
  return <caption ref={ref} className={caption({ className })} {...props} />;
});
TableCaption.displayName = "TableCaption";
