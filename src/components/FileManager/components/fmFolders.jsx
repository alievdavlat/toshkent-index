import React, {useState} from 'react';

import {LoadMoreVisible} from "components";
import {Input, Modal, notification, Spin} from "antd";
import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";

import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {ReactComponent as EditIcon} from "../../Table/icons/edit.svg";
import {ReactComponent as DeleteIcon} from "../../Table/icons/delete.svg";
import get from "lodash/get";

const FmFolders = ({setActiveFolder}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingU, setLoadingU] = useState(false);
  const [updateModal, showUpdateModal] = useState(false);
  const [selected, setSelected] = useState(false);

  const {t} = useTranslation("main");
  const dispatch = useDispatch();

  const onEnter = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      addFolder();
      setLoading(true);
    }
  };
  const addFolder = () => {
    dispatch(EntityActions.Form.request({
      method: 'post',
      entity: 'filemanagerFolder',
      name: `all`,
      url: `/filemanager/folder`,
      primaryKey: "id",
      values: {title: newFolderName},
      prependData: true,
      normalizeData: data => data,
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно"),
            duration: 2
          });
        },
        error: () => {
          notification["error"]({
            message: t("Что-то пошло не так"),
            duration: 2
          });
        },
        finally: () => {
          setLoading(false);
          setNewFolderName("");
        }
      }
    }))
  };

  const onEnterUpdate = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      setLoadingU(true);
      dispatch(EntityActions.Form.request({
        method: 'put',
        entity: 'filemanagerFolder',
        name: `all`,
        url: `/filemanager/folder/${get(selected, 'id')}`,
        primaryKey: "id",
        id: get(selected, 'id'),
        values: {title: event.target.value},
        prependData: true,
        normalizeData: data => data,
        cb: {
          success: () => {
            notification["success"]({
              message: t("Успешно"),
              duration: 2
            });
          },
          error: () => {
            notification["error"]({
              message: t("Что-то пошло не так"),
              duration: 2
            });
          },
          finally: () => {
            setLoadingU(false);
            showUpdateModal(false);
            setSelected(null);
          }
        }
      }))
    }
  };
  const onEdit = folder => {
    setSelected(folder);
    showUpdateModal(true);
  };

  const onDeleteHandler = (folder) => {
    Modal.confirm({
      title: t("Вы действительно хотите удалить?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      confirmLoading: true,
      onOk: () => deleteFile(folder),
    });
  };
  const deleteFile = folder => {
    setLoading(true);
    dispatch(EntityActions.Form.request({
      method: "delete",
      entity: 'filemanagerFolder',
      name: `all`,
      url: `/filemanager/folder/${folder.id}`,
      primaryKey: "id",
      id: folder.id,
      deleteData: true,
      cb: {
        success: () => {
          notification["success"]({
            message: t("Успешно удалено"),
            duration: 2
          });
        },
        error: () => {
          notification["error"]({
            message: t("Что-то пошло не так"),
            duration: 2
          });
        },
        finally: () => {
          setLoading(false)
        }
      }
    }))
  };

  return (
    <Spin spinning={loading}>
      <Modal
        visible={updateModal}
        onOk={() => showUpdateModal(true)}
        onCancel={() => showUpdateModal(false)}
        footer={null}
        centered
        width={430}
        title="Изменить названия папку"
        destroyOnClose
      >
        <Spin spinning={loadingU}>
          <Input
            name="alt"
            defaultValue={get(selected, 'title')}
            placeholder="Создать новый папка"
            onKeyDown={(e) => onEnterUpdate(e)}
          />
        </Spin>
      </Modal>
      <div className="fm-folders">
        <EntityContainer.All
          entity="filemanagerFolder"
          name={`all`}
          url="/filemanager/folder"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 30,
            page
          }}
        >
          {({items, isFetched, meta}) => {
            return (
              <div className="folder-items">
                <div className="folder-item" onClick={() => setActiveFolder(null)}>Все</div>
                {items.map((folder, idx) => (
                  <div className="folder-item" key={idx}>
                    <span onClick={() => setActiveFolder(folder)}>{folder.title}</span>
                    <div className="action-buttons">
                      <div className="action-btn edit-btn" onClick={() => onEdit(folder)}>
                        <EditIcon height={16} width={16}/>
                      </div>
                      <div className="action-btn delete-btn" onClick={() => onDeleteHandler(folder)}>
                        <DeleteIcon height={16} width={16}/>
                      </div>
                    </div>
                  </div>
                ))}

                {isFetched && meta &&
                meta.currentPage < meta.pageCount && (
                  <LoadMoreVisible
                    setPage={() =>
                      setPage(meta.currentPage + 1)
                    }
                  />
                )}
              </div>
            );
          }}
        </EntityContainer.All>
        <div className="add-folder mt-30">
          <Input
            name="alt"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="Создать новый папка"
            onKeyDown={(e) => onEnter(e)}
          />
        </div>
      </div>
    </Spin>
  );
};

export default FmFolders;