import React, {useEffect, useState} from 'react';

// import {LoadMoreVisible, Spinner} from "components";
// import {Search} from "components/SmallComponents";
import { ContainerAll } from '@/modules/container';

import get from "lodash/get";
import helpers from '@/services/helpers';
import FMUpload from "./fmUpload";
import {useDebounce} from "use-debounce";
import Image from 'next/image';

const FmList = ({selectedItems, setSelectedItems, filterType, setLoading, isLoading, activeFolder, useFileName,useFolderPath}) => {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [searchQuery] = useDebounce(query, 600);

    useEffect(() => {
        setPage(1);
    }, [filterType,activeFolder]);

    const onClickHandler = (e, item) => {
        if(e.ctrlKey) {
            let hasItem = selectedItems.find(i => i.id === item.id);
            let arr = [];
            if(hasItem){
                arr = selectedItems.filter(i => i.id !== item.id)
            }else{
                arr = [...selectedItems, item];
            }
            setSelectedItems(arr);
        }else{
            setSelectedItems([item])
        }
    }

    return (
        <ContainerAll
            entity="files"
            name={`allFiles-${filterType}`}
            url="/filemanager"
            dataKey="data"
            primaryKey="id"
            appendData={true}
            params={{
                limit: 20,
                sort: "-id",
                page,
                extra: {title: searchQuery},
                filter: {
                    ext: filterType === 'images' ? ['jpg', 'jpeg', 'png', 'svg'] : ['docx','xls','xlsx','txt','doc','pdf','mtl','obj'],
                    folder_id: activeFolder ? activeFolder.id : ''
                }
            }}>
            {({items, isFetched, meta}) => {
                return (
                    <div className="fm-list__wrapper">

                        {activeFolder && (
                            <div className="ml-5 mr-5 fs-16 fw-700 mb-20">{activeFolder.title}</div>
                        )}

                        {/* <div className="fm-search">
                            <Search text='Поиск действия' onSearch={setQuery} value={query} {...{setPage}} />
                        </div> */}

                        {filterType === "images" ? (
                            <div className="fm-list">
                                <FMUpload {...{setLoading, isLoading, filterType, activeFolder, useFileName,useFolderPath}}/>
                                {items.map(file => {
                                    let isActive = selectedItems.find(i => i.id === file.id);
                                    return(
                                        <div className={`image-file ${isActive ? 'selected' : ''}`} key={file.id}
                                             onClick={(e) => onClickHandler(e, file)}>
                                            <Image src={get(file, 'thumbnails.small.src')} width={200} height={200} alt=""
                                                 className="image-file__item"/>
                                            <div className="image-file__title">{get(file, 'title')}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="fm-list__doc">
                                <FMUpload {...{setLoading, isLoading, filterType, activeFolder, useFileName}}/>
                                {items.map(file => {
                                    let isActive = selectedItems.find(i => i.id === file.id);
                                    return(
                                        <div className={`doc-file ${isActive ? 'selected' : ''}`} key={file.id}
                                             onClick={(e) => onClickHandler(e, file)}>
                                            <div className="doc-file__item">
                                                <div className="doc-file__ext">{get(file, 'ext')}</div>
                                                <div className="doc-file__content">
                                                    <div className="doc-file__title">{get(file, 'title')}</div>
                                                    <div className="d-flex fs-12">
                                                        <div className="w-50p pr-10 d-flex">
                                                            {/*<div className="fw-500">Размер:</div>*/}
                                                            <div className="">{helpers.formatBytes(get(file, 'size'))}</div>
                                                        </div>
                                                        <div className="w-50p pl-10 d-flex">
                                                            {/*<div className="fw-500">Дата:</div>*/}
                                                            <div
                                                                className="">{helpers.formatDate(get(file, 'created_at'))}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* {!isFetched && (
                            <Spinner className="md"/>
                        )}

                        {isFetched && meta &&
                        meta.currentPage < meta.pageCount && (
                            <LoadMoreVisible
                                setPage={() =>
                                    setPage(meta.currentPage + 1)
                                }
                            />
                        )} */}
                    </div>
                )
            }}
        </ContainerAll>
    );
};

export default FmList;
