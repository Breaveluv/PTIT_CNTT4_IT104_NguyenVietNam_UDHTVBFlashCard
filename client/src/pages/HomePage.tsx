// Updated HomePage.tsx - Export Header, Footer, HomeContent separately
import { Footer as AntdFooter, Header as AntdHeader } from "antd/es/layout/layout";
import { Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
// *QUAN TRỌNG: Cần import file CSS để hiệu ứng hover hoạt động*
// Nếu bạn không dùng module bundler hoặc không muốn tạo file CSS, bạn cần dùng thư viện CSS-in-JS.
// Tuy nhiên, theo yêu cầu, tôi giả định bạn sẽ dùng cách này.
import './HomePage.css'; 

// Header component - Exported for Layout
export function Header() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    console.log(1111);
    navigate("/login");
  };

  return (
    <AntdHeader
      style={{
        backgroundColor: "#fff",
        padding: "0 8px", 
        lineHeight: "50px",
        height: '50px',
        borderBottom: "1px solid #e8e8e8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Gom nhóm Logo và Navigation vào một div để chúng nằm sát lề trái */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          className="logo"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000000",
            marginRight: '20px', // Khoảng cách giữa logo và navigation
          }}
        >
          VocabApp
        </div>
        
        {/* Nhóm Navigation Links - Sử dụng NavLink */}
        <div style={{
          display:'flex',
          gap:'10px',
          alignItems:'center'
        }}>
          {/* Áp dụng className="nav-link" để có màu xám mờ và hiệu ứng hover */}
         <NavLink 
           to="/" 
           className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
           style={{ margin: 0 }}
         >
           Dashboard
         </NavLink>
         
         <NavLink
           to="/categories"
           className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
           style={{ margin: 0 }}
         >
           Categories
         </NavLink>
         
         <NavLink 
           to="/words" 
           className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
           style={{ margin: 0 }}
         >
           Vocabulary
         </NavLink>
          <NavLink 
            to="/flashcards" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
            style={{ margin: 0 }}
          >
            FlashCard
          </NavLink>
          <NavLink 
            to="/quizz" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
            style={{ margin: 0 }}
          >
            Quizz
          </NavLink>
        </div>
      </div>
      {/* Kết thúc nhóm Logo và Navigation */}

      {/* Nhóm Buttons nằm ở góc phải */}
      <div className="nav-buttons">
        {currentUser ? (
          <Button
            type="primary"
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                marginRight: "8px",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </>
        )}
      </div>
    </AntdHeader>
  );
}

// HomeContent - The body content for index route
export function HomeContent() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  return (
    <div style={{ 
      background: "#f5f5f5", 
      minHeight: 'calc(100vh - 145px)', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#000',
          marginBottom: '10px'
        }}
      >
        Welcome to VocabApp
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '30px',
          textAlign: 'center',
          maxWidth: '600px'
        }}
      >
        Learn and practice vocabulary with flashcards and quizzes
      </p>
      <div
        style={{
          display: "flex",
          gap: '10px'
        }}
      >
        <Button
          type="primary"
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            height: '44px',
            fontSize: '16px'
          }}
          onClick={() => navigate(currentUser ? "/flashcards" : "/login")}
        >
          Get Started
        </Button>
        {!currentUser && (
          <Button
            type="primary"
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              height: '44px',
              fontSize: '16px'
            }}
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        )}
      </div>
    </div>
  );
}

// Footer component - Exported for Layout
export function Footer() {
  return (
    <AntdFooter
      style={{
        backgroundColor: '#fff',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: '10px 0',
        borderTop: '1px solid #e8e8e8'
      }}
    >
      © 2024 VocabApp. All rights reserved
    </AntdFooter>
  );
}

// Backward compatible full HomePage
export default function HomePage() {
  return (
    <>
      <Header />
      <HomeContent />
      <Footer />
    </>
  );
}