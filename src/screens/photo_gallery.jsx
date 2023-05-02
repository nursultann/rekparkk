import { useState, useEffect } from "react";
import DragAndDropUploader from "../components/drag_and_drop_uploader";
import Navbar from "../components/navbar";
import { Button, Form, notification, Image, Input } from "antd";
import { deleteGallery, sendPhotoGallery } from "../api/bussiness";
import { useHistory } from "react-router-dom";
import { userDetails } from "../api";
import moment from "moment";

const Gallery = () => {
    const history = useHistory();
    const [gallery, setGallery] = useState(null);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const UserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            setGallery(user.business_account.photogallery);
            console.log('user', user);
            moment.locale('ru');
        }
    }
    const Deletegallery = async (id) => {
        console.log('id', id);
        setLoad(true);
        const del = await deleteGallery(id);
        console.log('delete gallery', del);
        if (del.length == 0) {
            openNotification('success', 'Успешно удалено!', null);
            setLoad(false);
            UserDetails();
        } else {
            openNotification('error', 'Не удалось удалить!', null);
        }
    }
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const send = async () => {
        if (files) {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images[]', file);
            });
            formData.append('title', title);
            setLoading(true)
            const response = await sendPhotoGallery(formData)
            setLoading(false)
            if (response != null && response.success) {
                UserDetails();
                openNotification('success', 'Успешно сохранено!', null);
            } else {
                openNotification('error', 'Не удалось сохранить!', null);
            }
        }
    }
    useEffect(() => {
        UserDetails();
    }, [])
    return (
        <div>
            <Navbar />
            <div className="col-12 d-flex justify-content-center py-3">
                <div className="col-7 text-center py-3">
                    <h4>Добавление фото для галереи бизнес профиля</h4>
                    <Form
                        layout="vertical"
                    >
                        <Form.Item>
                            <p>Загрузите фото для галереи</p>
                            <center>
                                <DragAndDropUploader
                                    className="mb-3 p-2"
                                    style={{ maxWidth: 500 }}
                                    onChange={(file) => {
                                        setFiles([...files, file]);
                                    }}
                                    onRemove={(f) => {
                                        const index = files.indexOf(f);
                                        if (index !== -1) {
                                            const f = files.splice(index, 1);
                                            setFiles(f);
                                        }
                                    }}
                                />
                            </center>
                        </Form.Item>

                        <Form.Item
                            label="Заголовок для галереи"
                            rules={[
                                {
                                    type: 'text',
                                },
                                {
                                    required: true,
                                    message: 'Заголовок для галереи пуст',
                                },
                            ]}
                        >
                            <Input onChange={(e) => { setTitle(e.target.value) }} />
                            <center>
                                <Button
                                    className="mt-4"
                                    style={{ backgroundColor: '#184d9f', color: "#fff" }}
                                    loading={loading}
                                    onClick={send}
                                >
                                    Опубликовать
                                </Button>
                            </center>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="col-12">
                {
                    gallery != null ?
                        <div className="col-12 text-center py-4 mb-5">
                            <h4 className="text-left text-muted">Ранее добавленные галереи</h4>
                            <hr />
                            <div className="row">
                                {gallery.map((item) =>
                                    <div className="col-6 col-lg-3 mt-2">
                                        <div className="col-12 py-3 border rounded">
                                            <Image src={item.cover} width="100%" />
                                            <p className="py-1 text-left" style={{ fontSize: "15px" }}>Название галереи: {item.title}</p>
                                            <p className="text-muted text-left" style={{ fontSize: "12px" }}>{moment(item.media[0].created_at, 'YYYYMMDD, H:mm:ss', 'Asia/Bishkek').fromNow()}</p>
                                            <div className="row">
                                                <div className="col-12 text-left py-3">
                                                    <i className="fa-regular fa-trash-can" style={{ fontSize: "12px" }}></i> <Button style={{ fontSize: "12px" }} loading={load} onClick={() => Deletegallery(item.id)}>Удалить галерею</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                        :
                        <div className="col-12 text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}
export default Gallery;