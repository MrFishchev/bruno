/*
 * WithSecure Cloud Protection
 *
 * Copyright (c) 2024 WithSecure Corporation
 * MIT License
 */

import React, { useState, useRef } from 'react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { IconTrash } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { addBinaryParam, updateBinaryParam } from 'providers/ReduxStore/slices/collections';
import StyledWrapper from './StyledWrapper';
import { useEffect } from 'react';

const BinaryParams = ({ item, collection }) => {
  const dispatch = useDispatch();
  const [fileParam, setFileParam] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const fileInput = useRef(null);

  useEffect(() => {
    if (!fileParam) {
      return;
    }

    const param = cloneDeep(fileParam);
    if (selectedFile !== null) {
      param.value = {
        type: selectedFile.type,
        name: selectedFile.name,
        path: selectedFile.path,
        size: selectedFile.size
      };
    } else {
      param.value = null;
      fileInput.current.value = '';
    }

    dispatch(
      updateBinaryParam({
        param: param,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  }, [selectedFile]);

  useEffect(() => {
    dispatch(
      addBinaryParam({
        itemUid: item.uid,
        collectionUid: collection.uid,
        type: 'file'
      })
    );
  }, []);

  useEffect(() => {
    var param = item.draft ? get(item, 'draft.request.body.binaryFile') : get(item, 'request.body.binaryFile');

    // Skipping as param has not been created yet
    if (!param) {
      return;
    }

    setFileParam(param);
  }, [item]);

  return (
    <StyledWrapper className="w-full">
      <div className="flex items-center">
        {fileParam ? (
          <>
            <input
              type="file"
              className="
                  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm
                  text-slate-500"
              ref={fileInput}
              onChange={(e) => setSelectedFile(e.target.files?.length > 0 ? e.target.files[0] : null)}
            />
            {selectedFile && selectedFile !== null && (
              <button tabIndex="-1">
                <IconTrash strokeWidth={1.5} size={20} onClick={() => setSelectedFile(null)} />
              </button>
            )}
          </>
        ) : null}
      </div>
    </StyledWrapper>
  );
};
export default BinaryParams;
