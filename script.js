// 台中市網站大改造專案 - JavaScript 互動功能

// DOM 元素
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');
const searchInput = document.querySelector('.navbar-search input');
const serviceCards = document.querySelectorAll('.service-card');
const newsCards = document.querySelectorAll('.news-card');
const menuItems = document.querySelectorAll('.menu-item');

// 輪播圖功能
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
let autoPlayInterval;

// 切換到指定幻燈片
function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// 移動輪播圖
function moveCarousel(direction) {
    goToSlide(currentSlide + direction);
    resetAutoPlay();
}

// 自動播放
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000); // 每5秒切換
}

// 重置自動播放
function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// 啟動自動播放
if (slides.length > 0) {
    startAutoPlay();
}

// 導航選單切換（手機版）
if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open'); // 用於控制遮罩和鎖定捲動

        // 切換圖示
        if (navbarMenu.classList.contains('active')) {
            navbarToggle.textContent = '✕';
        } else {
            navbarToggle.textContent = '☰';
        }
    });
}

// 點擊選單連結後自動關閉
menuItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbarMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                navbarToggle.textContent = '☰';
            }
        });
    }
});

// 點擊遮罩關閉選單 (透過監聽 document 點擊)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        navbarMenu.classList.contains('active') &&
        !navbarMenu.contains(e.target) &&
        !navbarToggle.contains(e.target)) {

        navbarMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        navbarToggle.textContent = '☰';
    }
});

// 下拉選單互動（手機版點擊展開）
menuItems.forEach(item => {
    const menuLink = item.querySelector('.menu-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (dropdown && window.innerWidth <= 768) {
        menuLink.addEventListener('click', (e) => {
            // 如果是手機版，阻止跳轉並切換下拉
            e.preventDefault();
            item.classList.toggle('active'); // 使用 class 控制箭頭旋轉等
            dropdown.classList.toggle('active');
        });
    }
});

// 搜尋功能
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`搜尋：${searchTerm}\n（此為示範功能，實際應用需連接後端搜尋系統）`);
                searchInput.value = '';
            }
        }
    });
}

// 服務卡片點擊效果
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.service-title') ? card.querySelector('.service-title').textContent : '服務項目';
        alert(`您點擊了：${title}\n（此為示範功能，實際應用會導向對應服務頁面）`);
    });
});

// 新聞卡片點擊效果
newsCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.news-title').textContent;
        alert(`查看新聞：${title}\n（此為示範功能，實際應用會導向完整新聞頁面）`);
    });
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滾動時導航欄效果
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-xl)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-lg)';
    }

    lastScroll = currentScroll;
});

// 卡片進入視窗動畫
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 觀察所有卡片
document.querySelectorAll('.service-card, .news-card, .service-card-modern').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// 按鈕點擊效果
document.querySelectorAll('.btn, .btn-modern, .service-btn-modern').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // 創建漣漪效果
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// 社群連結點擊
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.textContent;
        alert(`開啟社群平台：${platform}\n（此為示範功能，實際應用會連結到對應社群頁面）`);
    });
});

// 頁面載入完成
window.addEventListener('load', () => {
    console.log('台中市網站大改造專案已載入完成！');
    console.log('這是一個現代化的政府網站示範專案');
});

// 觸發漣漪動畫樣式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
    
    /* 遮罩層樣式 (JS控制) */
    body.menu-open::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999; /* 在 navbar (1000) 下方但在內容上方... 等等，Sidebar 需要比 navbar 高嗎？通常是 */
        backdrop-filter: blur(2px);
        animation: fadeIn 0.3s forwards;
    }
`;
document.head.appendChild(style);
