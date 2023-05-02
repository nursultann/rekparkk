import { Upload, Modal } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { React, useState } from "react";
import { AppImage } from "./custom_components";

const { Dragger } = Upload;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const DragAndDropUploader = ({ style, className, onChange, onRemove, multiple = true }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState(false);
    const [previewImage, setPreviewImage] = useState();

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        setPreviewVisible(true);
    };

    const props = {
        name: 'file',
        multiple: multiple,
        listType: "picture-card",
        maxCount: 10,
        beforeUpload: files => {
            console.log('before upload', files);
            if (onChange != null) onChange(files);
            return false
        },
        onPreview: handlePreview,
        onChange(info) {
            const { status } = info.file;
            // console.log('Selected files ' + info.file, info.fileList);
            // console.log('onChange', info.fileList);
            // if (onChange != null) onChange(info.fileList);
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
            // if (onChange != null) onChange(e.dataTransfer.files);
        },
        onRemove(file) {
            if (onRemove != null) onRemove(file);
        }
    };

    return (
        <>
            <Dragger {...props} style={style} className={className}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Нажмите или перетащите файлы, чтобы загрузить</p>
            </Dragger>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <AppImage src={previewImage} />
            </Modal>
        </>
    );
};

export default DragAndDropUploader;