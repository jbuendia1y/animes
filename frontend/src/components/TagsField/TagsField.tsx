import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Tag } from "../../models/tag.model";
import { InfiniteScrool } from "../InfiniteScrool";
import { usePaginateTags } from "./usePaginateTags";

const Row = forwardRef<
  HTMLLIElement,
  { tag: Tag; handleToggle: (id: string) => void; selecteds: Tag[] }
>(({ tag, handleToggle, selecteds }, ref) => {
  return (
    <ListItem
      className="tag-field-list-item"
      ref={ref}
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={() => {
            handleToggle(tag.values.id);
          }}
          checked={selecteds.indexOf(tag) !== -1}
        />
      }
    >
      <ListItemButton>
        <ListItemText primary={tag.values.slug} />
      </ListItemButton>
    </ListItem>
  );
});

export function TagsField({ onChange }: { onChange: (data: Tag[]) => void }) {
  const { tags, currentPage, goTo } = usePaginateTags();
  const [selecteds, setSelecteds] = useState<Tag[]>([]);

  const handleToggle = (id: string) => {
    const newSelecteds = [...selecteds];

    const tagInList = newSelecteds.find((v) => v.values.id === id);
    if (tagInList) {
      const idx = newSelecteds.indexOf(tagInList);
      if (idx !== -1) newSelecteds.splice(idx, 1);

      setSelecteds(newSelecteds);
      onChange(newSelecteds);
      return;
    }

    const fetched = tags?.find((v) => v.values.id === id);
    if (fetched) newSelecteds.push(fetched);

    setSelecteds(newSelecteds);
    onChange(newSelecteds);
  };

  const loadMoreItems = () => {
    goTo(currentPage + 1);
  };

  return (
    <>
      <InfiniteScrool
        component={List}
        id="tag-field-list"
        sx={{ maxHeight: 100, overflowY: "auto" }}
        data={tags ?? []}
        onChange={loadMoreItems}
        renderItem={(data, ref) => (
          <Row
            key={`tag-field-list-item-${(data as Tag).values.id}`}
            tag={data as Tag}
            handleToggle={handleToggle}
            selecteds={selecteds}
            ref={ref}
          />
        )}
      />
    </>
  );
}
