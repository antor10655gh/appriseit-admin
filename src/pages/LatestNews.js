import { Space, Table, Button, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import useDataLoad from "../customHooks/useDataLoad";

const { confirm } = Modal;
const { Column } = Table;

// add new make & modal is here

const LatestNews = () => {
  const apiUrl = "http://localhost:5000/api/v1/latest_news";
  const { data, loading, error } = useDataLoad(
    apiUrl,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    [apiUrl]
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // delete model is open
  const showConfirm = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleOutlined />,
      content:
        "After click on delete then your item will be delete permanently.",
      okText: "Delete",
      okType: "danger",

      onOk() {
        fetch(`http://localhost:5000/api/v1/latest_news/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.status === "success") {
              window.location.reload();
            }
          });
      },

      onCancel() {
        console.log("Cancel");
      },
    });
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
        <h1>All Latest News</h1>
        <div>
          <div style={{ marginRight: "10px" }}>
            <Button type="primary">
              <Link to="/add_latest_news">
                <PlusOutlined style={{ marginRight: "5px" }} />
                Add LatestNewses
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <Table dataSource={data}>
          <Column
            title="Image"
            dataIndex="newsBanner"
            key="newsBanner"
            render={(_, record) => (
              <img
                src={`http://localhost:5000/multerfile${record.newsBanner}`}
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
                <Button type="danger" onClick={() => showConfirm(record._id)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default LatestNews;
