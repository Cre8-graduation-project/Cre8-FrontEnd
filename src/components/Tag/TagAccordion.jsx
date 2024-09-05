import React, { useEffect, useState, useCallback } from "react";
import TagSelector from "./TagSelector";
import TagChildSelector from "./TagChildSelector";
import { tagLoader, tagElementLoader } from "./TagLoader";
import { isEmpty } from "../../provider/utilityProvider";
import classes from "./Tag.module.css";

function TagAccordion({
  selectedTag,
  setTag,
  selectedElement,
  setElement,
  onTagChange,
  onElementChange,
}) {
  const [tagData, setTagData] = useState([]);
  const [tagElementData, setTagElementData] = useState([]);

  // Load Tag Data on initial build
  useEffect(() => {
    tagLoader().then((data) => {
      setTagData(data);
    });
  }, []);

  const loadTagElements = useCallback(() => {
    // Update Tag Child
    if (selectedTag) {
      tagElementLoader(selectedTag).then(setTagElementData);
    } else {
      setTagElementData([]);
    }
    // Update Search Key Object
    onTagChange();
  }, [selectedTag, onTagChange]);

  // on Main Tag Change
  useEffect(() => {
    loadTagElements();
  }, [selectedTag]);

  // on Tag Child Change
  useEffect(() => {
    onElementChange();
  }, [selectedElement]);

  return (
    <>
      {isEmpty(tagData) && <></>}
      {!isEmpty(tagData) && (
        <div className={classes.tagAccordion}>
          <TagSelector
            title="작업 분야"
            tagList={tagData}
            selectedTag={selectedTag}
            setTag={setTag}
            toggle={true}
          />
          {tagElementData &&
            tagElementData.map((subTag, index) => (
              <TagChildSelector
                key={index}
                title={subTag.subCategoryName}
                tagList={subTag.workFieldChildTagResponseDtoList}
                selectedElement={selectedElement}
                setElement={setElement}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default React.memo(TagAccordion);