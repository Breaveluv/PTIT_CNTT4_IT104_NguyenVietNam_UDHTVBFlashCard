import { useState, useMemo, useEffect } from 'react';
import { Select, Button, Table, Progress, Tag, Row, Col, Space, Spin } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getWords, updateWord, type Word } from '../slice/WordSlice';
import { getCategories } from '../slice/CategoriesSlice';
import {   } from '../slice/WordSlice'; 
export default function FlashCard() {
  const dispatch = useAppDispatch();
  const { data: words, loading, error } = useAppSelector((state) => state.words);
  const categoriesData = useAppSelector((state: any) => state.categories?.data || []);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | number>('all');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    dispatch(getWords());
    dispatch(getCategories());
  }, [dispatch]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categoriesData.map((c: any) => ({ value: c.id, label: c.name }))
  ];

  const filteredWords = useMemo(() => {
    if (selectedCategory === 'all') {
      return words;
    }
    return words.filter((w: Word) => w.categoryId === selectedCategory);
  }, [words, selectedCategory]);

  const totalWords = filteredWords.length;
  const currentWord = totalWords > 0 ? filteredWords[currentWordIndex] : null;
  const learnedCount = filteredWords.filter((w: Word) => w.isLearned).length;

 

  const handleNext = () => {
    if (totalWords === 0) return;
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % totalWords);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (totalWords === 0) return;
    setCurrentWordIndex((prevIndex) => (prevIndex - 1 + totalWords) % totalWords);
    setIsFlipped(false);
  };

  const handleMarkAsLearned = async () => {
    if (!currentWord || currentWord.isLearned) return;

    try {
      await dispatch(
        updateWord({
          id: currentWord.id,
          word: currentWord.word,
          meaning: currentWord.meaning,
          topic: currentWord.topic || '',
          categoryId: currentWord.categoryId,
          isLearned: true,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update word:', err);
    }
  };

  const handleCategoryChange = (value: 'all' | number) => {
    setSelectedCategory(value);
    setCurrentWordIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  if (loading) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const currentCategoryName = selectedCategory === 'all' 
    ? 'All Categories' 
    : categoriesData.find((c: any) => c.id === selectedCategory)?.name || '';

  if (totalWords === 0 || !currentWord) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Flashcard Learning</h1>
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }}>
          <Col>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: 150 }}
              options={categoryOptions}
              loading={!categoriesData.length && selectedCategory !== 'all'}
            />
          </Col>
        </Row>
        <div style={{
          padding: 24,
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          textAlign: 'center'
        }}>
          {selectedCategory === 'all' ? 'Không có từ vựng nào.' : 'Không có từ nào trong danh mục này.'}
        </div>
        {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      </div>
    );
  }


  const columns = [
    {
      title: 'WORD',
      dataIndex: 'word',
      key: 'word',
      width: '30%',
    },
    {
      title: 'MEANING',
      dataIndex: 'meaning',
      key: 'meaning',
      width: '30%',
    },
    {
      title: 'STATUS',
      key: 'status',
      width: '40%',
      render: (word: Word) => (
        <Tag color={word.isLearned ? 'success' : 'error'}>
          {word.isLearned ? 'LEARNED' : 'NOT LEARNED'}
        </Tag>
      ),
    },
  ];

 
  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>

     
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Flashcard Learning </h1>
        </Col>
      </Row>
      <Row style={{ marginBottom: 24 }}>
        <Col>
        
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ width: 1300,
              marginBottom:"10px"
             }}
            options={categoryOptions}
          />
        </Col>
      </Row>

      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 40,
       
        perspective: '1000px',
        width: 450, 
        height: 250,
        margin: '0 auto',
      }}>
     
        <div
          onClick={handleFlip}
          style={{
            width: '91%',
            height: '74%',
            position: 'relative',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformOrigin: 'center center',
          }}
        >
         
          <div
            style={{
              position: 'absolute',
              width: '91%',
              height: '74%',
              backfaceVisibility: 'hidden', 
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              border: '1px solid #f0f0f0', 
            }}
          >
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#595959' }}>
              {currentWord.meaning}
            </div>
          </div>

   
          <div
            style={{
              position: 'absolute',
              width: '91%',
              height: '74%',
              backfaceVisibility: 'hidden', 
              backgroundColor: '#e6f7ff', 
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,

              transform: 'rotateY(180deg)',
              border: '1px solid #91d5ff',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff' }}>
              {currentWord.word}
            </div>
          </div>
        </div>
      </div>

      
      <Space size="middle" style={{ marginBottom: 24, width: '100%', justifyContent: 'center' }}>
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={handlePrevious}
          disabled={totalWords <= 1}
        >
          Previous
        </Button>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          style={{ backgroundColor: currentWord.isLearned ? '#52c41a' : '#52c41a', borderColor: '#52c41a' }}
          onClick={handleMarkAsLearned}
          disabled={currentWord.isLearned}
          loading={loading}
        >
          Mark as Learned
        </Button>
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={totalWords <= 1}
        >
          Next
        </Button>
      </Space>

     
      <div style={{
        width: 450,
        textAlign: 'center',
        margin: '20px auto 40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <p style={{ marginBottom: 8, color: '#595959', alignSelf: 'flex-start' }}>
          Progress
        </p>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Progress
            percent={Math.round((learnedCount / totalWords) * 100)}
            size="small"
            showInfo={false}
            style={{ flexGrow: 1, marginRight: 8 }}
          />
          <span style={{ color: '#595959' }}>{learnedCount}/{totalWords}</span>
        </div>
      </div>

      <h2 style={{ marginBottom: 16, marginTop: 20 }}>Word List</h2>
      <Table
        columns={columns}
        dataSource={filteredWords}
        pagination={false}
        rowKey="id"
        rowClassName={(record: Word) => record.id === currentWord.id ? 'ant-table-row-selected' : ''}
        style={{ borderRadius: 8, overflow: 'hidden' }}
        loading={loading}
      />
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}