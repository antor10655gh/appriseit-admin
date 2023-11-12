import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
const { TextArea } = Input;

const AddLatestNews = () => {
  const navigate = useHistory();
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const time = moment().format("LL");

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (values) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("newsBanner", file);
    });

    formData.append("author", values.author);
    formData.append("title", values.title);
    formData.append("news_desc", values.news_desc);
    formData.append("post_date", time);

    setUploading(true);

    fetch("http://localhost:5000/api/v1/latest_news/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("Upload successful.");
        navigate.push("/latest_news");
      })
      .catch((error) => {
        console.error("Error uploading:", error);
        message.error("Upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

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
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} lg={8}>
        <Form onFinish={handleUpload} layout="vertical">
          <Form.Item
            name="author"
            label="Author Name"
            placeholder="Enter author name"
            rules={[
              {
                required: true,
                message: "Please enter author name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title"
            label="News Title"
            placeholder="Enter news title"
            rules={[
              {
                required: true,
                message: "Please enter news title",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="news_desc"
            label="News Description"
            placeholder="Enter news description"
            rules={[
              {
                required: true,
                message: "Please enter news description",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          {/* <Form.Item
            name="post_date"
            label="Post Date"
            placeholder="Enter post date"
            rules={[
              {
                required: true,
                message: "Please enter post date",
              },
            ]}
          >
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            name="file"
            label="Upload your photo"
            rules={[
              {
                required: true,
                message: "Please enter new price",
              },
            ]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AddLatestNews;
