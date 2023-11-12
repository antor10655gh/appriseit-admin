import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};

const { confirm } = Modal;
const { Column, ColumnGroup } = Table;

// add new make & modal is here

const LatestNews = () => {
  // make & model list get from here
  const [count, setCount] = useState(false);
  const [latestNewses, setLatestNewses] = useState([]);
  const newLatestNewses = [];
  [...latestNewses].reverse().map((news) => newLatestNewses.push(news));
  const getLatestNewses = async () => {
    const response = await fetch("http://localhost:5000/api/v1/latest_news", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    const data = await response.json();
    setLatestNewses(data);
    setCount(true);
  };

  useEffect(() => {
    getLatestNewses();
  }, [count]);

  let lastKey = parseInt(latestNewses[latestNewses.length - 1]?.key) + 1;

  // delete model is open
  const showConfirm = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleOutlined />,
      content:
        "After click on delete then your item will be delete permanently.",
      okText: "Delete",
      okType: "danger",

      onOk() {},

      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log(values.file.file.name);
    let newValues = { ...values, key: lastKey ? lastKey : 1 };
    fetch("http://localhost:5000/api/v1/latest_news/update", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newValues),
    })
      .then((res) => res.json())
      .then((json) => {
        toast.success("Successfully Product Create!", {
          autoClose: 1000,
        });
        console.log(json);
        getLatestNewses();
        setOpen(false);
      });
  };

  // edit make & model
  const [isEditing, setIsEditing] = useState(false);
  const [editingLatestNewses, setEditingLatestNewses] = useState(null);

  const editMakeModal = (record) => {
    setIsEditing(true);
    setEditingLatestNewses({ ...record });
    console.log(record._id);
  };

  // upload file
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Create Special Credits</h1>
        <div>
          <div style={{ marginRight: "10px" }}>
            <Button
              type="primary"
              // onClick={() => {
              //   setOpen(true);
              // }}
            >
              <Link to="/add_latest_news">
                <PlusOutlined style={{ marginRight: "5px" }} />
                Add LatestNewses
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <Table dataSource={newLatestNewses}>
          <Column
            title="Image"
            dataIndex="newsBanner"
            key="newsBanner"
            render={(_, record) => (
              <img
                src={`http://localhost:5000/api/v1/multerFile${record.newsBanner}`}
                alt="newsBanner"
                style={{ width: "50px", height: "50px" }}
              />
            )}
          />
          <Column title="Author" dataIndex="author" key="author" />
          <Column title="Title" dataIndex="title" key="title" />
          <Column title="Time" dataIndex="post_date" key="post_date" />
          <Column
            title="Action"
            key="action"
            width="100px"
            render={(_, record) => (
              <Space size="middle">
                <Button type="primary" onClick={() => editMakeModal(record)}>
                  <EditOutlined />
                </Button>
                {/* <Link to={`/edit_latestNewses/${record._id}`}>
                  <Button type="primary">
                    <EditOutlined />
                  </Button>
                </Link> */}
                <Button type="danger" onClick={() => showConfirm(record._id)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            )}
          />
        </Table>
        <Modal
          title="Edit Price List"
          okText="Save"
          visible={isEditing}
          onCancel={() => {
            setIsEditing(false);
          }}
          onOk={() => {
            const formData = new FormData();

            fileList.forEach((file) => {
              formData.append("newsBanner", file);
            });
            formData.append("author", editingLatestNewses.author);
            formData.append("title", editingLatestNewses.title);
            formData.append("news_desc", editingLatestNewses.news_desc);
            fetch(
              `http://localhost:5000/api/v1/latest_news/update/${editingLatestNewses._id}`,
              {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((json) => {
                toast.success("Credits Update Successfully", {
                  autoClose: 1000,
                });
                setIsEditing(false);
                getLatestNewses();
              });
          }}
        >
          <Form
            layout="vertical"
            initialValues={{
              modifier: "public",
            }}
          >
            <Form.Item label="Author">
              <Input
                value={editingLatestNewses?.author}
                onChange={(e) => {
                  setEditingLatestNewses((pre) => {
                    return { ...pre, author: e.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Title">
              <Input
                style={{
                  width: "100%",
                }}
                value={editingLatestNewses?.title}
                onChange={(e) => {
                  setEditingLatestNewses((pre) => {
                    return { ...pre, title: e.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="New Price">
              <Input
                style={{
                  width: "100%",
                }}
                value={editingLatestNewses?.news_desc}
                onChange={(e) => {
                  setEditingLatestNewses((pre) => {
                    return { ...pre, news_desc: e.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="File">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LatestNews;
