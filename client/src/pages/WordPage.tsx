import { useState, useEffect } from 'react';
import { Layout, Typography, Button, Row, Col, Card, Input, Select, Modal, Form, Space, Table } from 'antd';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getWords, createWord, updateWord, deleteWord } from '../slice/WordSlice';
import { getCategories } from '../slice/CategoriesSlice'; 
import './WordPage.css'; 

const { Content, Footer } = Layout;
const { Title, Text } = Typography; 
const { Search, TextArea } = Input; 


interface Word {
    id: number;
    word: string;
    meaning: string;
    
    topic?: string; 
    categoryId?: number; 
    isLearned?: boolean;
}


interface Category {
  id: number;
  name: string;
  description: string;
}


export default function WordPage() {
    const dispatch = useAppDispatch();
    const { data: words, loading, error } = useAppSelector((state) => state.words);
    
    const categories: Category[] = useAppSelector((state: any) => state.categories?.data || []);
    
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | number>('all');
    
    useEffect(() => {
        dispatch(getWords());
        dispatch(getCategories());
    }, [dispatch]);

    
  // Mở modal thêm/sửa, hiển thị dữ liệu cũ nếu sửa
  const showModal = (word: Word | null = null) => {
    setEditingWord(word);
    setIsModalVisible(true);
    form.setFieldsValue(word || { word: '', meaning: '', categoryId: undefined });
  };

  // Xử lý thêm/sửa từ vựng
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingWord) {
        await dispatch(updateWord({ id: editingWord.id, ...values })).unwrap();
      } else {
        await dispatch(createWord(values)).unwrap();
      }
      setIsModalVisible(false);
      setEditingWord(null);
      form.resetFields();
    } catch (err: any) {
      console.error('Validation Failed:', err);
    }
  };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingWord(null);
        form.resetFields();
    };



    const showDeleteModal = (id: number) => {
        setDeletingId(id);
        setIsDeleteModalVisible(true);
    };

  // Xử lý xóa từ vựng
  const handleDeleteOk = async () => {
    if (deletingId !== null) {
      await dispatch(deleteWord(deletingId)).unwrap();
    }
    setIsDeleteModalVisible(false);
    setDeletingId(null);
  };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingId(null);
    };
    
    
    
    // Tìm kiếm và lọc từ vựng
    const filteredWords = words.filter((item: Word) => {
        const matchSearch = item.word.toLowerCase().includes(searchValue.toLowerCase());
        const matchCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
        return matchSearch && matchCategory;
    });

    const columns = [
        { title: 'WORD', dataIndex: 'word', key: 'word', width: '25%' },
        { title: 'MEANING', dataIndex: 'meaning', key: 'meaning', width: '35%' },
        { 
          title: 'CATEGORY',
          dataIndex: 'categoryId', 
          key: 'categoryName', 
          width: '20%',
          render: (categoryId: number | undefined) => { 
            if (!categoryId) return 'N/A';
            const category = categories.find(c => c.id === categoryId); 
            return category ? category.name : 'N/A'; 
          }
        },
        { 
          title: 'ACTIONS',
          key: 'actions',
          width: '20%',
          align: 'right' as const,
          render: (_:any, record: Word) => (
            <Space size="middle">
              <Button 
                onClick={() => showModal(record)}
                type="link"
              >
                Edit
              </Button>
              <Button 
                danger 
                onClick={() => showDeleteModal(record.id)}
                type="link"
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ];
      
    
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];


  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      <Content style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        <div className="vocabulary-quiz-container">
          
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Vocabulary Words
              </Title>
            </Col>
            
            <Col>
              <Button 
                type="primary" 
                size="large" 
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => showModal(null)} 
                loading={loading}
              >
                Add New Word
              </Button>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            
            <Col span={24}>
              <Select
                value={selectedCategory}
                size="large"
                style={{ width: '100%' }}
                options={categoryOptions}
                onChange={setSelectedCategory}
              />
            </Col>
            
            <Col span={24}>
              <Search
                placeholder="Search vocabulary..."
                allowClear
                size="large"
                style={{ width: '100%' }}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </Col>
          </Row>
        </div>

      
        <div style={{ marginTop: '40px' }}>
        
          <Card 
            bodyStyle={{ padding: '16px 24px', backgroundColor: '#fff', borderRadius: '8px' }}
          >
            <Row gutter={[16, 0]} style={{ fontWeight: 'bold', color: '#595959' }}>
              <Col span={6}>
                <Text strong>WORD</Text> 
              </Col>
              <Col span={8}>
                <Text strong>MEANING</Text> 
              </Col>
              <Col span={6}>
                <Text strong>CATEGORY</Text>  
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Text strong>ACTIONS</Text>
              </Col>
            </Row>
          </Card>
          
          
          <div style={{ marginTop: '8px' }}>
            <Card bodyStyle={{ padding: 0 }}>
                <Table 
          columns={columns}
          dataSource={filteredWords}
          pagination={false}
          rowKey="id"
          loading={loading}
          showHeader={false}
        />
                {error && <div style={{ padding: '16px', color: 'red' }}>{error}</div>}
            </Card>
          </div>
        </div>

      </Content>
      
      <Footer 
        style={{ 
          textAlign: 'center', 
          backgroundColor: '#f0f2f5', 
          padding: '24px 0',
        }}
      >
        
      </Footer>
      
      
     
      <Modal
        title={editingWord ? "Edit Word" : "Add New Word"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingWord ? "Save" : "Save"} 
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{ disabled: loading, style: { backgroundColor: '#1890ff', borderColor: '#1890ff' } }} 
      >
        <Form
          form={form}
          layout="vertical"
          name="word_form"
        >
          <Form.Item
            name="word"
            label="Word"
            rules={[{ required: true, message: 'Please input the word!' }]}
          >
            <Input placeholder="Word" size="large" />
          </Form.Item>
          
          <Form.Item
            name="meaning"
            label="Meaning"
            rules={[{ required: true, message: 'Please input the meaning!' }]}
          >
            <TextArea rows={4} placeholder="Meaning" />
          </Form.Item>
          
        
          <Form.Item
            name="categoryId" 
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select 
                placeholder="Select Category"
                options={[
                    { value: undefined, label: 'Select Category', disabled: true }, 
                    
                    ...categories.map(c => ({ value: c.id, label: c.name }))
                ]}
            />
          </Form.Item>
         
          
        </Form>
      </Modal>

    
      
    
   
      <Modal
        title="Delete Word"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        confirmLoading={loading}
        
        
        footer={[
          <Button 
            key="cancel" 
            onClick={handleDeleteCancel}
          
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary" 
            danger 
            onClick={handleDeleteOk}
            loading={loading}
          >
            Delete
          </Button>,
        ]}
      >
        
          <p style={{ marginTop: '20px', marginBottom: '30px' }}>Are you sure you want to delete this word?</p>
      </Modal>
    </Layout>
  );
}