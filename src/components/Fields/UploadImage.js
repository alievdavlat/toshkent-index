import React, {useEffect, useState} from "react";
import axios from "axios";
import { Upload } from "antd";
import get from "lodash/get";
import Image from "next/image";

const UploadImage = (props) => {
    const [token, setToken] = useState('');
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        setToken(window.localStorage.getItem('access-token'));
    }, [])

  const { setProgress, errorCb, activeFolderId, useFolderPath, acceptAll } = props;

  const config = {
    onUploadProgress: function(progressEvent) {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded * 100) / total);
      setProgress(percent);
    },
    headers: {
      Authorization: `JWT ${token}`
    }
  };

  const customRequest = options => {
    const data = new FormData();
    data.append("file", options.file);
    if(activeFolderId){
      data.append('folder_id', activeFolderId);
    }
    if(useFolderPath){
      data.append('useFolderPath', useFolderPath);
    }

    axios
      .post(options.action, data, config)
      .then(res => {
        options.onSuccess(res.data, options.file);
        setImageUrl(res.data)
      })
      .catch(err => {
        errorCb(err)
      });
  };

  const onPreview = file => {
    let url = "";
    if (file.url) {
      url = file.preview
    } else {
      const keys = Object.keys(get(file, "response", {}));
      url = get(file, ["response", keys[0], "link"]);
    }
    return window.open(url);
  };

  return (
    <Upload
      accept={acceptAll ? '' : 'image/png,image/jpeg,image/jpeg,image/bmp,image/svg'}
      {...props}
      {...{
        customRequest,
        onPreview
      }}>
        <Image src={test} width={100} height={100} alt="logo"/>
    </Upload>
  );
}

export default UploadImage;
