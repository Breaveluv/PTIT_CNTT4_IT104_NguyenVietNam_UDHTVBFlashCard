import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks'; 
import { Button, Input, Table, Space, Modal, Form, Pagination, Spin, Alert, Typography, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { RootState } from '../store';
import { getCategories, createCategory, updateCategory, deleteCategory, clearError } from '../slice/CategoriesSlice';
import "./CategoriesPage.css"

const { Search } = Input;


interface Category {
  id: number;
  name: string;
  description: string;
}


const selectCategories = (state: RootState): Category[] => state.categories?.data || [];
const selectLoading = (state: RootState) => state.categories?.loading || false;
const selectError = (state: RootState) => state.categories?.error || null;

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectCategories);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
  
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
 
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchValue, data]);

  const showModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue(category || { name: '', description: '' });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const trimmedValues = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : ''
      };

      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, ...trimmedValues })).unwrap();
      } else {
        await dispatch(createCategory(trimmedValues)).unwrap();
      }
      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (err: any) {
      console.error('Modal error:', err);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const showDeleteModal = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = () => {
    if (deletingId) {
      dispatch(deleteCategory(deletingId));
    }
    setIsDeleteModalVisible(false);
    setDeletingId(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setDeletingId(null);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  
  const filteredData = (data || []).filter(item => 
    item.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    (item.description || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: 'NAME', dataIndex: 'name', key: 'name' },
    { title: 'DESCRIPTION', dataIndex: 'description', key: 'description' },
    { 
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_:any, record: Category) => (
        <Space size="middle">
          <Button 
            onClick={() => showModal(record)}
            type="link"
          >
            edit
          </Button>
          <Button 
            danger 
            onClick={() => showDeleteModal(record.id)}
            type="link"
          >
            delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', background: '#f5f5f5' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="categories-content" style={{ background: '#f5f5f5', minHeight: 'calc(94,5vh - 100px)', padding: '20px' }}>
      
      
      {error && (
        <Alert 
          message="Lỗi" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: 16 }} 
          closable 
          onClose={() => dispatch(clearError())}
        />
      )}

    
      <div style={{ marginBottom: 20 }}>
      
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              
              <Col>
                  <Typography.Title level={2} style={{ margin: 0 }}>
                      Vocabulary Categories
                  </Typography.Title>
              </Col>

          
              <Col>
                  <Button 
                      type="primary" 
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} 
                      size="large"
                      onClick={() => showModal(null)}
                      loading={loading}
                      disabled={loading}
                  >
                      Add New Category
                  </Button>
              </Col>
          </Row>

    
          <Row>
              <Col span={24}>
                  <Search 
                      placeholder="Search categories..." 
                      onSearch={onSearch} 
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      style={{ width: '100%' }} 
                      size="large"
                      loading={loading}
                  />
              </Col>
          </Row>
      </div>


     
      <Table 
        columns={columns} 
        dataSource={paginatedData} 
        pagination={false}
        rowKey="id"
        loading={loading}
        style={{ background: '#fff', borderRadius: 8 }}
      />


      
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Pagination 
          current={currentPage} 
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>


      
      <Modal
        title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm mới Danh mục"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingCategory ? "Lưu thay đổi" : "Thêm mới"}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
      >
        <Form
          form={form}
          layout="vertical"
          name="category_form"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
              {
               
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.resolve(); 
                  }
                  
                  
                  const trimmedValue = value.trim();

                  if (!trimmedValue) {
                      return Promise.reject(new Error('Tên danh mục không được để trống chỉ với khoảng trắng!'));
                  }

                  
                  const isDuplicate = data.some(item => {
                  
                    return item.name.toLowerCase() === trimmedValue.toLowerCase() && 
                           item.id !== editingCategory?.id;
                  });

                  if (isDuplicate) {
                    return Promise.reject(new Error('Tên danh mục đã tồn tại! Vui lòng chọn tên khác.'));
                  }
                  
                
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            name="description"
            label="description"
          >
            <Input placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>


    <Modal
        title="Delete Category"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        confirmLoading={loading}
        className="delete-category-confirm-modal" 
    >
        <p>Are you sure you want to delete this category?</p>
    </Modal>
    </div>
  );
}