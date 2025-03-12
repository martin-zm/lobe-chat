import { CloseOutlined, FolderOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

const RagFile: React.FC = memo(() => {
  // 状态管理
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: '您好！请上传文件并输入您的问题。', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 添加一个ref用于滚动
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // 滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 在消息更新后滚动到底部
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 打开和关闭弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 处理文件上传
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const acceptedTypes = [
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/msword', // DOC
      ];

      if (!acceptedTypes.includes(file.type)) {
        message.error('只能上传 PDF、DOCX 或 DOC 文件！');
        return Upload.LIST_IGNORE;
      }
      setSelectedFile(file);
      addMessage(`已选择文件: ${file.name}`, 'bot');
      return false;
    },
    showUploadList: false,
    accept: '.pdf,.docx,.doc',
  };

  // 添加消息到聊天记录
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  // 发送消息
  const sendMessage = () => {
    if (!inputValue.trim()) {
      message.warning('请输入问题');
      return;
    }

    if (!selectedFile) {
      message.warning('请先上传文件');
      return;
    }

    addMessage(inputValue, 'user');
    setIsLoading(true);

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('query', inputValue);

    // 发送请求到API
    fetch('http://192.168.1.200:6001/get_rag_response', {
      method: 'POST',
      body: formData,
      // 添加跨域请求头
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);

        if (data && data.result) {
          addMessage(data.result, 'bot');
        } else {
          addMessage('收到了响应，但格式不正确', 'bot');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error:', error);
        addMessage(`发生错误: ${error.message}`, 'bot');
      });

    setInputValue('');
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        // Ctrl+Enter 换行，不做任何处理让默认行为发生
        return;
      } else {
        // 单独按 Enter 发送消息
        e.preventDefault(); // 阻止默认的换行行为
        sendMessage();
      }
    }
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Button type="primary" icon={<FolderOutlined />} onClick={showModal} title="RAG-Chat">
        打开RAG-Chat
      </Button>

      <Modal
        title="RAG-Chat"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1600}
        bodyStyle={{ padding: '32px' }}
        style={{ top: 20 }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Upload {...uploadProps}>
            <Button icon={<FolderOutlined />} size="large">
              上传文件
            </Button>
          </Upload>
          <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>
            支持的文件类型: PDF, DOCX, DOC
          </span>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            height: '800px',
          }}
        >
          {/* 聊天消息区域 */}
          <div
            style={{
              height: '680px',
              overflowY: 'auto',
              marginBottom: '24px',
              padding: '24px',
              border: '1px solid #eee',
              borderRadius: '8px',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  padding: '16px 24px',
                  borderRadius: '24px',
                  maxWidth: '75%',
                  wordWrap: 'break-word',
                  backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f1f1f1',
                  marginLeft: msg.sender === 'user' ? 'auto' : '0',
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {msg.sender === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p style={{ margin: '8px 0' }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ paddingLeft: '20px' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ paddingLeft: '20px' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1890ff' }}
                        >
                          {children}
                        </a>
                      ),
                      // @ts-ignore
                      code: ({ inline, children }) =>
                        inline ? (
                          <code
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              padding: '2px 4px',
                              borderRadius: '3px',
                            }}
                          >
                            {children}
                          </code>
                        ) : (
                          <pre
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              padding: '12px',
                              borderRadius: '5px',
                              overflowX: 'auto',
                            }}
                          >
                            <code>{children}</code>
                          </pre>
                        ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: '4px solid #ddd',
                            paddingLeft: '16px',
                            margin: '16px 0',
                            color: '#666',
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            ))}

            {/* 添加一个空的div作为滚动目标 */}
            <div ref={messagesEndRef} />

            {/* 加载指示器 */}
            {isLoading && (
              <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '16px' }}>
                <p>正在处理，请稍候...</p>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div style={{ position: 'relative' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入您的问题..."
              autoSize={{ minRows: 5, maxRows: 10 }}
              onKeyDown={handleKeyDown}
              style={{
                paddingRight: '150px',
                fontSize: '16px',
                borderRadius: '10px',
                padding: '16px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
              }}
            >
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                size="large"
                style={{ height: '48px', width: '120px', fontSize: '16px' }}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default RagFile;
