// ============================================
// দৈনিক সংবাদ - সম্পূর্ণ JavaScript ফাইল
// Version: 2.0 - সব ফিক্স সহ
// ============================================

// গ্লোবাল ভেরিয়েবল
let allPosts = [];
let currentPosts = 6;
let currentCategory = 'all';
let categories = [];

// ============================================
// ১. মেইন ইনিশিয়ালাইজেশন
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('দৈনিক সংবাদ - পৃষ্ঠা লোড সম্পন্ন');
    
    // বেসিক ইনিশিয়ালাইজেশন
    initializeApp();
    
    // ইভেন্ট লিসেনার সেটআপ
    setupEventListeners();
    
    // ডেটা লোড
    loadInitialData();
    
    // Font Awesome চেক
    checkFontAwesome();
    
    // URL থেকে পোস্ট লোড (যদি থাকে)
    loadPostFromURL();
});

// ============================================
// ২. অ্যাপ ইনিশিয়ালাইজেশন
// ============================================

function initializeApp() {
    console.log('অ্যাপ ইনিশিয়ালাইজেশন শুরু...');
    
    // তারিখ-সময় আপডেট
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // বাংলা তারিখ
    updateBanglaDate();
    
    // কপিরাইট বছর
    updateCopyrightYear();
    
    // স্ক্রল টপ বাটন
    setupScrollTopButton();
    
    console.log('অ্যাপ ইনিশিয়ালাইজেশন সম্পন্ন');
}

// ============================================
// ৩. ইভেন্ট লিসেনার সেটআপ
// ============================================

function setupEventListeners() {
    console.log('ইভেন্ট লিসেনার সেটআপ শুরু...');
    
    // মোবাইল মেনু বাটন
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navContainer = document.querySelector('.nav-container');
    const body = document.body;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // মেনু টগল
            navContainer.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // আইকন পরিবর্তন
            const icon = this.querySelector('i');
            if (icon) {
                if (navContainer.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
    
    // হোম লিঙ্ক
    const homeLinks = ['homeLink', 'mobileHomeLink'];
    homeLinks.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showHomepage();
                closeMobileMenu();
            });
        }
    });
    
    // সার্চ
    const searchToggle = document.getElementById('searchToggle');
    const closeSearch = document.getElementById('closeSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('searchOverlay').classList.add('active');
            closeMobileMenu();
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            document.getElementById('searchOverlay').classList.remove('active');
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // সার্চ ইনপুট
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // থিম টগল
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    // ফন্ট সাইজ
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFontSize();
        });
    }
    
    // ব্যাক টু হোম
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', showHomepage);
    }
    
    // লোড মোর
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNews);
    }
    
    // ভিউ অল
    const viewAllFeatured = document.getElementById('viewAllFeatured');
    if (viewAllFeatured) {
        viewAllFeatured.addEventListener('click', function(e) {
            e.preventDefault();
            filterByCategory('all');
        });
    }
    
    // ক্যাটেগরি ফিল্টার সেটআপ
    setupCategoryFilter();
    
    // নেভিগেশন লিঙ্ক সেটআপ
    setupNavigationLinks();
    
    // সাইডবার ক্যাটেগরি লিঙ্ক
    setupSidebarCategoryLinks();
    
    // ফুটার লিঙ্ক
    setupFooterLinks();
    
    // বাইরে ক্লিক করলে মোবাইল মেনু বন্ধ
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && 
            !e.target.closest('.mobile-menu-btn') && 
            navContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    console.log('ইভেন্ট লিসেনার সেটআপ সম্পন্ন');
}

// ============================================
// ৪. ডেটা লোডিং
// ============================================

function loadInitialData() {
    console.log('ইনিশিয়াল ডেটা লোড শুরু...');
    
    Promise.all([
        loadCategories(),
        loadPosts()
    ]).then(() => {
        console.log('সমস্ত ডেটা সফলভাবে লোড হয়েছে');
    }).catch(error => {
        console.error('ডেটা লোড ত্রুটি:', error);
        useDefaultData();
    });
}

// ============================================
// ৫. ক্যাটেগরি লোড
// ============================================

function loadCategories() {
    return new Promise((resolve, reject) => {
        fetch('categories.json')
            .then(response => {
                if (!response.ok) throw new Error('Categories JSON not found');
                return response.json();
            })
            .then(data => {
                categories = data;
                displayCategories(data);
                displayCategoryFilter(data);
                setupCategoryList(data);
                resolve(data);
            })
            .catch(error => {
                console.warn('ডিফল্ট ক্যাটেগরি ব্যবহার করা হচ্ছে');
                const defaultCategories = getDefaultCategories();
                categories = defaultCategories;
                displayCategories(defaultCategories);
                displayCategoryFilter(defaultCategories);
                setupCategoryList(defaultCategories);
                resolve(defaultCategories);
            });
    });
}

function getDefaultCategories() {
    return [
        { id: 1, name: "জাতীয়", icon: "fas fa-flag", color: "#e53e3e" },
        { id: 2, name: "আন্তর্জাতিক", icon: "fas fa-globe-asia", color: "#3182ce" },
        { id: 3, name: "খেলাধুলা", icon: "fas fa-futbol", color: "#38a169" },
        { id: 4, name: "বিনোদন", icon: "fas fa-film", color: "#d69e2e" },
        { id: 5, name: "রাজনীতি", icon: "fas fa-landmark", color: "#805ad5" },
        { id: 6, name: "বাণিজ্য", icon: "fas fa-chart-line", color: "#dd6b20" },
        { id: 7, name: "প্রযুক্তি", icon: "fas fa-laptop", color: "#319795" },
        { id: 8, name: "স্বাস্থ্য", icon: "fas fa-heartbeat", color: "#e53e3e" }
    ];
}

// ============================================
// ৬. পোস্ট লোড
// ============================================

function loadPosts() {
    return new Promise((resolve, reject) => {
        fetch('posts.json')
            .then(response => {
                if (!response.ok) throw new Error('Posts JSON not found');
                return response.text();
            })
            .then(text => {
                try {
                    const posts = JSON.parse(text);
                    allPosts = posts;
                    displayBreakingNews(posts);
                    displayFeaturedNews(posts);
                    displayLatestNews(posts);
                    displayPopularNews(posts);
                    resolve(posts);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    throw parseError;
                }
            })
            .catch(error => {
                console.warn('ডিফল্ট পোস্ট ব্যবহার করা হচ্ছে');
                const defaultPosts = generateDefaultPosts();
                allPosts = defaultPosts;
                displayBreakingNews(defaultPosts);
                displayFeaturedNews(defaultPosts);
                displayLatestNews(defaultPosts);
                displayPopularNews(defaultPosts);
                resolve(defaultPosts);
            });
    });
}

function generateDefaultPosts() {
    const defaultCategories = getDefaultCategories();
    const posts = [];
    
    // ... ডিফল্ট পোস্ট জেনারেশন কোড ...
    // (আপনার আগের generateDefaultPosts ফাংশন এখানে যোগ করুন)
    
    return posts;
}

function useDefaultData() {
    const defaultCategories = getDefaultCategories();
    const defaultPosts = generateDefaultPosts();
    
    categories = defaultCategories;
    allPosts = defaultPosts;
    
    displayCategories(defaultCategories);
    displayCategoryFilter(defaultCategories);
    setupCategoryList(defaultCategories);
    displayBreakingNews(defaultPosts);
    displayFeaturedNews(defaultPosts);
    displayLatestNews(defaultPosts);
    displayPopularNews(defaultPosts);
}

// ============================================
// ৭. UI ডিসপ্লে ফাংশন
// ============================================

function displayCategories(cats) {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    let html = '<li><a href="#" class="active" data-category="all"><i class="fas fa-home"></i> হোম</a></li>';
    
    cats.forEach(cat => {
        html += `
            <li>
                <a href="#" data-category="${cat.id}">
                    <i class="${cat.icon}"></i> ${cat.name}
                </a>
            </li>
        `;
    });
    
    navMenu.innerHTML = html;
}

function displayCategoryFilter(cats) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    let html = '<button class="filter-btn active" data-category="all">সর্বমোট</button>';
    
    cats.forEach(cat => {
        html += `
            <button class="filter-btn" data-category="${cat.id}" style="border-left: 3px solid ${cat.color}">
                ${cat.name}
            </button>
        `;
    });
    
    categoryFilter.innerHTML = html;
}

function setupCategoryList(cats) {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    let html = '';
    cats.forEach(cat => {
        html += `
            <a href="#" data-category="${cat.id}">
                <i class="${cat.icon}"></i> ${cat.name}
            </a>
        `;
    });
    
    categoryList.innerHTML = html;
}

function displayBreakingNews(posts) {
    const breakingSlider = document.getElementById('breakingSlider');
    if (!breakingSlider) return;
    
    const breakingPosts = posts.filter(post => post.breaking).slice(0, 3);
    if (breakingPosts.length === 0 && posts.length > 0) {
        breakingPosts.push(posts[0]);
    }
    
    let html = '';
    breakingPosts.forEach(post => {
        html += `<div>${post.title}</div>`;
    });
    
    breakingSlider.innerHTML = html;
}

function displayFeaturedNews(posts) {
    const featuredNews = document.getElementById('featuredNews');
    if (!featuredNews) return;
    
    const featuredPosts = posts.filter(post => post.featured).slice(0, 3);
    if (featuredPosts.length === 0 && posts.length >= 3) {
        featuredPosts.push(posts[0], posts[1], posts[2]);
    }
    
    featuredNews.innerHTML = '';
    featuredPosts.forEach(post => {
        featuredNews.appendChild(createNewsArticle(post, true));
    });
}

function displayLatestNews(posts) {
    const latestNews = document.getElementById('latestNews');
    if (!latestNews) return;
    
    const latestPosts = posts.filter(post => !post.featured).slice(0, 6);
    
    latestNews.innerHTML = '';
    latestPosts.forEach(post => {
        latestNews.appendChild(createNewsArticle(post, false));
    });
    
    currentPosts = 6;
}

function displayPopularNews(posts) {
    const popularNews = document.getElementById('popularNews');
    if (!popularNews) return;
    
    const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    
    let html = '';
    popularPosts.forEach((post, index) => {
        html += `
            <div class="popular-item" data-id="${post.id}">
                <div class="popular-rank">${index + 1}</div>
                <div class="popular-content">
                    <h4>${post.title}</h4>
                    <div class="popular-meta">
                        <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                        <span><i class="far fa-eye"></i> ${formatNumber(post.views)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    popularNews.innerHTML = html;
    
    // ক্লিক ইভেন্ট
    popularNews.querySelectorAll('.popular-item').forEach(item => {
        item.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-id'));
            loadPostDetail(postId);
        });
    });
}

function createNewsArticle(post, isFeatured) {
    const article = document.createElement('article');
    article.className = isFeatured ? 'featured-article' : 'news-article';
    article.setAttribute('data-id', post.id);
    article.setAttribute('data-category', post.category.id);
    
    const content = `
        <div class="${isFeatured ? 'featured-img' : 'news-img'}">
            <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200/1a365d/ffffff?text=সংবাদ+ছবি';">
        </div>
        <div class="${isFeatured ? 'featured-content' : 'news-content'}">
            <span class="${isFeatured ? 'featured-category' : 'news-category'}" style="background-color: ${post.category.color || '#4299e1'}">
                ${post.category.name}
            </span>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="${isFeatured ? 'featured-meta' : 'news-meta'}">
                <span><i class="far fa-user"></i> ${post.author}</span>
                <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                ${!isFeatured ? `<span><i class="far fa-eye"></i> ${formatNumber(post.views)}</span>` : ''}
            </div>
        </div>
    `;
    
    article.innerHTML = content;
    
    // ক্লিক ইভেন্ট
    article.addEventListener('click', function() {
        loadPostDetail(post.id);
    });
    
    return article;
}

// ============================================
// ৮. ক্যাটেগরি ফিল্টারিং সিস্টেম (FIXED)
// ============================================

function setupCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    categoryFilter.addEventListener('click', function(e) {
        const button = e.target.closest('.filter-btn');
        if (!button) return;
        
        e.preventDefault();
        const categoryId = button.getAttribute('data-category');
        
        // একটিভ ক্লাস
        categoryFilter.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // ফিল্টার অ্যাপ্লাই
        filterByCategory(categoryId);
    });
}

function setupNavigationLinks() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    navMenu.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        e.preventDefault();
        const categoryId = link.getAttribute('data-category');
        
        if (categoryId === 'all') {
            showHomepage();
        } else {
            filterByCategory(categoryId);
        }
        
        // একটিভ ক্লাস
        navMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        closeMobileMenu();
    });
}

function setupSidebarCategoryLinks() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    categoryList.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        e.preventDefault();
        const categoryId = link.getAttribute('data-category');
        filterByCategory(categoryId);
    });
}

function setupFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-links a[data-category]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.getAttribute('data-category');
            filterByCategory(categoryId);
        });
    });
}

function filterByCategory(categoryId) {
    console.log(`ক্যাটেগরি ফিল্টার: ${categoryId}`);
    
    currentCategory = categoryId;
    const latestNews = document.getElementById('latestNews');
    if (!latestNews) return;
    
    // নেভিগেশন মেনুতে active
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === categoryId.toString()) {
            link.classList.add('active');
        }
    });
    
    if (categoryId === 'all') {
        // সব পোস্ট
        const nonFeaturedPosts = allPosts.filter(post => !post.featured);
        latestNews.innerHTML = '';
        nonFeaturedPosts.slice(0, 6).forEach(post => {
            latestNews.appendChild(createNewsArticle(post, false));
        });
        
        document.getElementById('loadMoreBtn').style.display = 'inline-flex';
        currentPosts = 6;
    } else {
        // নির্দিষ্ট ক্যাটেগরি
        const filteredPosts = allPosts.filter(post => 
            post.category.id == categoryId && !post.featured
        );
        
        latestNews.innerHTML = '';
        
        if (filteredPosts.length > 0) {
            filteredPosts.slice(0, 6).forEach(post => {
                latestNews.appendChild(createNewsArticle(post, false));
            });
            document.getElementById('loadMoreBtn').style.display = 'none';
        } else {
            latestNews.innerHTML = `
                <div class="no-news">
                    <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 15px; color: #ddd;"></i>
                    <p>এই ক্যাটেগরিতে কোন সংবাদ পাওয়া যায়নি।</p>
                </div>
            `;
            document.getElementById('loadMoreBtn').style.display = 'none';
        }
    }
    
    showHomepage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ৯. পোস্ট ডিটেইল সিস্টেম (সম্পর্কিত পোস্ট সহ)
// ============================================

function loadPostDetail(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) {
        alert('পোস্টটি পাওয়া যায়নি');
        return;
    }
    
    // URL আপডেট
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('post', postId);
    window.history.pushState({}, '', newUrl);
    
    // পোস্ট ডিটেইল পেজ দেখান
    showPostDetailPage();
    
    // কন্টেন্ট লোড
    const postDetail = document.getElementById('postDetail');
    if (!postDetail) return;
    
    // পুরানো সম্পর্কিত পোস্ট মুছুন
    const oldRelated = document.querySelector('.related-posts');
    if (oldRelated) oldRelated.remove();
    
    postDetail.innerHTML = `
        <div class="post-header">
            <span class="post-category" style="background-color: ${post.category.color || '#4299e1'}">
                ${post.category.name}
            </span>
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span><i class="far fa-user"></i> ${post.author}</span>
                <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                <span><i class="far fa-eye"></i> ${formatNumber(post.views)} ভিউ</span>
                <span><i class="far fa-clock"></i> ${Math.ceil(post.content.length / 500)} মিনিট পড়া</span>
            </div>
        </div>
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400/1a365d/ffffff?text=সংবাদ+ছবি';">
        </div>
        <div class="post-content">
            ${post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            <div class="post-tags">
                <a href="#" class="tag-link" data-category="${post.category.id}">#${post.category.name}</a>
                <a href="#">#সংবাদ</a>
                <a href="#">#বাংলাদেশ</a>
                <a href="#">#সাম্প্রতিক</a>
            </div>
        </div>
    `;
    
    // ট্যাগ লিঙ্কে ইভেন্ট
    postDetail.querySelectorAll('.tag-link').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.getAttribute('data-category');
            filterByCategory(categoryId);
            showHomepage();
        });
    });
    
    // ভিউ কাউন্ট
    post.views += 1;
    displayPopularNews(allPosts);
    
    // সম্পর্কিত পোস্ট
    showRelatedPosts(post.category.id, postId);
}

function showRelatedPosts(categoryId, currentPostId) {
    // একই ক্যাটেগরির পোস্ট (বর্তমান পোস্ট বাদে)
    const relatedPosts = allPosts.filter(post => 
        post.category.id == categoryId && post.id != currentPostId
    ).slice(0, 3);
    
    if (relatedPosts.length === 0) return;
    
    // সম্পর্কিত পোস্ট সেকশন
    const relatedSection = document.createElement('section');
    relatedSection.className = 'related-posts';
    relatedSection.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-link"></i> সম্পর্কিত সংবাদ</h2>
        </div>
        <div class="related-grid">
            ${relatedPosts.map(post => `
                <article class="related-article" data-id="${post.id}">
                    <div class="related-img">
                        <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/1a365d/ffffff?text=সংবাদ+ছবি';">
                    </div>
                    <div class="related-content">
                        <span class="related-category" style="background-color: ${post.category.color || '#4299e1'}">
                            ${post.category.name}
                        </span>
                        <h3>${post.title}</h3>
                        <div class="related-meta">
                            <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                            <span><i class="far fa-eye"></i> ${formatNumber(post.views)}</span>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
    
    // যোগ করুন
    const postContent = document.querySelector('.post-content');
    if (postContent) {
        postContent.parentNode.insertBefore(relatedSection, postContent.nextSibling);
        
        // ক্লিক ইভেন্ট
        relatedSection.querySelectorAll('.related-article').forEach(article => {
            article.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                loadPostDetail(postId);
            });
        });
    }
}

function loadPostFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
        loadPostDetail(parseInt(postId));
    } else {
        showHomepage();
    }
}

// ============================================
// ১০. পেজ নেভিগেশন
// ============================================

function showHomepage() {
    // URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('post');
    window.history.pushState({}, '', newUrl);
    
    // পেজ স্যুইচ
    const homepage = document.getElementById('homepage');
    const postDetailPage = document.getElementById('postDetailPage');
    
    if (homepage) homepage.classList.add('active');
    if (postDetailPage) postDetailPage.classList.remove('active');
    
    // নেভিগেশন সক্রিয়
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-category') === 'all') {
                link.classList.add('active');
            }
        });
    }
    
    // ফিল্টার বাটন
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPostDetailPage() {
    const homepage = document.getElementById('homepage');
    const postDetailPage = document.getElementById('postDetailPage');
    
    if (homepage) homepage.classList.remove('active');
    if (postDetailPage) postDetailPage.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
}

function closeMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const body = document.body;
    
    if (navContainer && navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        body.classList.remove('menu-open');
        
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    }
}

// ============================================
// ১১. ইউটিলিটি ফাংশন
// ============================================

function updateDateTime() {
    const datetimeElement = document.getElementById('datetime');
    if (!datetimeElement) return;
    
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const dateStr = now.toLocaleDateString('bn-BD', options);
    const timeStr = now.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    datetimeElement.textContent = `${dateStr} | ${timeStr}`;
}

function updateBanglaDate() {
    const banglaDateElement = document.getElementById('banglaDate');
    if (!banglaDateElement) return;
    
    const banglaMonths = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
    const now = new Date();
    const banglaDate = new Date(now.getTime() + (6 * 60 + 21) * 60000);
    const banglaYear = banglaDate.getFullYear() - 593;
    const banglaMonth = banglaMonths[banglaDate.getMonth()];
    const banglaDay = banglaDate.getDate();
    
    banglaDateElement.textContent = `${banglaDay} ${banglaMonth} ${banglaYear}`;
}

function updateCopyrightYear() {
    const copyrightYear = document.getElementById('copyrightYear');
    if (!copyrightYear) return;
    
    const currentYear = new Date().getFullYear();
    copyrightYear.textContent = currentYear;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// ============================================
// ১২. থিম এবং ফন্ট সাইজ
// ============================================

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function toggleFontSize() {
    const body = document.body;
    const currentSize = localStorage.getItem('fontSize') || 'medium';
    let newSize;
    
    if (currentSize === 'small') {
        newSize = 'medium';
    } else if (currentSize === 'medium') {
        newSize = 'large';
    } else {
        newSize = 'small';
    }
    
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${newSize}`);
    localStorage.setItem('fontSize', newSize);
}

function loadSavedPreferences() {
    // থিম
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    // ফন্ট সাইজ
    const savedSize = localStorage.getItem('fontSize') || 'medium';
    document.body.classList.add(`font-${savedSize}`);
}

// ============================================
// ১৩. সার্চ ফাংশন
// ============================================

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        searchResults.innerHTML = '<div class="search-result-item">দয়া করে কিছু টাইপ করুন...</div>';
        return;
    }
    
    const results = allPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    ).slice(0, 10);
    
    searchResults.innerHTML = '';
    
    if (results.length > 0) {
        results.forEach(post => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h4>${post.title}</h4>
                <p>${post.excerpt.substring(0, 100)}...</p>
                <small><i class="far fa-calendar"></i> ${formatDate(post.date)} | <i class="fas fa-tag"></i> ${post.category.name}</small>
            `;
            
            resultItem.addEventListener('click', function() {
                loadPostDetail(post.id);
                document.getElementById('searchOverlay').classList.remove('active');
                searchInput.value = '';
            });
            
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.innerHTML = '<div class="search-result-item">কোন ফলাফল পাওয়া যায়নি।</div>';
    }
}

// ============================================
// ১৪. লোড মোর
// ============================================

function loadMoreNews() {
    const latestNews = document.getElementById('latestNews');
    const nonFeaturedPosts = allPosts.filter(post => !post.featured);
    
    const nextPosts = nonFeaturedPosts.slice(currentPosts, currentPosts + 3);
    
    if (nextPosts.length > 0) {
        nextPosts.forEach(post => {
            latestNews.appendChild(createNewsArticle(post, false));
        });
        
        currentPosts += 3;
        
        if (currentPosts >= nonFeaturedPosts.length) {
            document.getElementById('loadMoreBtn').style.display = 'none';
        }
    } else {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
}

// ============================================
// ১৫. স্ক্রল টপ বাটন
// ============================================

function setupScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// ১৬. ফন্ট অয়েসাম চেক
// ============================================

function checkFontAwesome() {
    setTimeout(() => {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-home';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const content = computedStyle.content;
        
        if (content === 'none' || content === '""' || content === 'normal') {
            useIconFallbacks();
        }
        
        document.body.removeChild(testIcon);
    }, 1000);
}

function useIconFallbacks() {
    const iconMap = {
        'fa-moon': '🌙',
        'fa-sun': '☀️',
        'fa-font': 'A',
        'fa-bars': '☰',
        'fa-times': '✕',
        'fa-home': '🏠',
        'fa-flag': '🇧🇩',
        'fa-globe-asia': '🌏',
        'fa-futbol': '⚽',
        'fa-film': '🎬',
        'fa-landmark': '🏛️',
        'fa-chart-line': '📈',
        'fa-laptop': '💻',
        'fa-heartbeat': '❤️',
        'fa-newspaper': '📰',
        'fa-search': '🔍',
        'fa-sign-in-alt': '🔐',
        'fa-user-plus': '👤+',
        'fa-chevron-up': '↑',
        'fa-arrow-left': '←',
        'fa-arrow-right': '→',
        'fa-plus': '+',
        'fa-fire': '🔥',
        'fa-list': '📋',
        'fa-calendar-day': '📅',
        'fa-user': '👤',
        'fa-calendar': '📅',
        'fa-eye': '👁️',
        'fa-clock': '🕒',
        'fa-star': '⭐',
        'fa-bolt': '⚡',
        'fa-facebook-f': 'f',
        'fa-twitter': 't',
        'fa-youtube': 'y',
        'fa-instagram': 'ig',
        'fa-link': '🔗'
    };
    
    document.querySelectorAll('i').forEach(icon => {
        icon.classList.forEach(className => {
            if (iconMap[className]) {
                icon.textContent = iconMap[className];
                icon.style.fontFamily = 'Arial, sans-serif';
                icon.style.fontSize = '1.2em';
                return;
            }
        });
    });
}

// ============================================
// ১৭. ব্রাউজার হিস্টোরি
// ============================================

window.addEventListener('popstate', function() {
    loadPostFromURL();
});

// ============================================
// ১৮. পৃষ্ঠা লোড হওয়ার পর
// ============================================

window.addEventListener('load', function() {
    // প্রেফারেন্স লোড
    loadSavedPreferences();
    
    // Font Awesome আবার চেক
    setTimeout(() => {
        const icons = document.querySelectorAll('.fas, .far, .fab');
        let loadedIcons = 0;
        
        icons.forEach(icon => {
            const computedStyle = window.getComputedStyle(icon, ':before');
            if (computedStyle.content && computedStyle.content !== 'none' && computedStyle.content !== '""' && computedStyle.content !== 'normal') {
                loadedIcons++;
            }
        });
        
        if (loadedIcons === 0 && icons.length > 0) {
            useIconFallbacks();
        }
    }, 2000);
});

// সম্পর্কিত পোস্ট CSS
const relatedPostsCSS = `
.related-posts {
    margin-top: 50px;
    padding-top: 30px;
    border-top: 2px solid #e2e8f0;
}
.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
.related-article {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    cursor: pointer;
}
.related-article:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.related-img {
    height: 150px;
    width: 100%;
    overflow: hidden;
}
.related-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}
.related-article:hover .related-img img {
    transform: scale(1.05);
}
.related-content {
    padding: 15px;
}
.related-category {
    display: inline-block;
    background-color: #e53e3e;
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    margin-bottom: 10px;
}
.related-content h3 {
    font-size: 1rem;
    margin-bottom: 10px;
    color: #2d3748;
    line-height: 1.3;
}
.related-meta {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 0.75rem;
}
@media (max-width: 768px) {
    .related-grid {
        grid-template-columns: 1fr;
    }
}
`;

// CSS ইনজেক্ট
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = relatedPostsCSS;
    document.head.appendChild(style);
});

console.log('দৈনিক সংবাদ JavaScript ফাইল লোড হয়েছে - সব ফিক্স সহ');