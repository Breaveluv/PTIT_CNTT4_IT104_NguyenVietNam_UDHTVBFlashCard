import React from 'react';
import { Layout, Typography, Select, Button, Table, Space, Card, Row, Col } from 'antd';
import type { TableProps } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface QuizHistoryItem {
  key: string;
  date: string;
  category: string;
  score: string;
}

const quizHistoryData: QuizHistoryItem[] = [
 
];

const columns: TableProps<QuizHistoryItem>['columns'] = [
  {
    title: 'DATE',
    dataIndex: 'date',
    key: 'date',

    align: 'left', 
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: 'CATEGORY',
    dataIndex: 'category',
    key: 'category',
    align: 'left',
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: 'SCORE',
    dataIndex: 'score',
    key: 'score',
    align: 'left',
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
];

export default function Quizz() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          <Row justify="space-between" align="middle" style={{ width: '100%' }}>
            <Col>
              <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
                Vocabulary Quiz
              </Title>
            </Col>
            <Col>
              <Button 
                type="primary" 
                size="large"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} // Màu xanh lá cây
                onClick={() => console.log('Start Quiz Clicked')}
              >
                Start Quiz
              </Button>
            </Col>
          </Row>

          <Card style={{ padding: 0, boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}>
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'general', label: 'General' },
                { value: 'science', label: 'Science' },
                { value: 'technology', label: 'Technology' },
              ]}
            />
          </Card>

          <Title level={4} style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 600 }}>
            Quiz History
          </Title>
          <Card 
            bodyStyle={{ padding: 0 }} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}
          >
            <Table
              columns={columns}
              dataSource={quizHistoryData}
              pagination={false} 
              showHeader={true} 
            
              components={{
                header: {
                  wrapper: (props) => <thead {...props} style={{ backgroundColor: '#f7f7f7' }} />,
                },
              }}
              rowClassName={() => 'quiz-history-row'} 
              style={{ width: '100%' }}
            />
            <style>
              {`
                .ant-table-thead > tr > th {
                  font-weight: 600;
                  color: rgba(0, 0, 0, 0.85);
                  background-color: #ffffff; /* Thiết lập header background về trắng */
                  border-bottom: 1px solid #f0f0f0;
                  padding-top: 16px;
                  padding-bottom: 16px;
                }
                .ant-table-tbody > tr > td {
                  font-weight: 500;
                  color: rgba(0, 0, 0, 0.85);
                  padding-top: 16px;
                  padding-bottom: 16px;
                }
                .ant-table-row:last-child .ant-table-cell {
                    border-bottom: none; /* Loại bỏ border dưới cùng của hàng cuối cùng */
              `}
            </style>
          </Card>

        </Space>
      </Content>
      
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5', padding: '24px 0' }}>
        © 2024 VocabApp. All rights reserved.
      </Footer>
    </Layout>
  );
}

