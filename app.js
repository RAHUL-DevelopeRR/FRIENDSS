// Friends Memory Webpage JavaScript
class FriendsMemoryApp {
    constructor() {
        this.timelineMemories = [];
        this.galleryImages = [];
        this.friends = [];
        this.messages = [];
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.renderContent();
        this.initHeartCursor();
        this.initScrollAnimations();
        this.startHeartBurst();
    }

    loadData() {
        // Load data from the provided JSON
        this.timelineMemories = [
            {
                year: "2020",
                title: "The Beginning of Forever Friendships 💖",
                description: "When we first met and our hearts knew we were meant to be best friends forever! The spark of friendship that would bloom into something beautiful 🌹✨",
                image: "heart-2020.jpg"
            },
            {
                year: "2021",
                title: "Virtual Hugs & Real Heart Connections 💻💕",
                description: "Even through screens, our hearts stayed connected and our friendship grew stronger during the pandemic days. Love knows no distance! 💖",
                image: "heart-2021.jpg"
            },
            {
                year: "2022",
                title: "Epic Adventures & Heart-Filled Moments 🌊❤️",
                description: "Our first big trip together - Goa beaches, golden sunsets, and hearts full of laughter. The memories that made our bond unbreakable! 🏖️💫",
                image: "heart-2022.jpg"
            },
            {
                year: "2023",
                title: "Milestone Celebrations & Love Overflowing 🎉💖",
                description: "Birthdays, achievements, and celebrations that filled our hearts with joy. Creating memories that will be treasured forever! 🎂🌹",
                image: "heart-2023.jpg"
            },
            {
                year: "2024",
                title: "Growing Stronger, Hearts Still United 🌟💕",
                description: "Another beautiful year of adventures, inside jokes, and being there for each other through thick and thin. Our friendship blooms eternal! 🌹✨",
                image: "heart-2024.jpg"
            },
            {
                year: "2025",
                title: "New Memories, Same Loving Hearts 💖🌈",
                description: "As we step into another year, our hearts are full of excitement for the new memories we'll create together! The best is yet to come 🌹💫",
                image: "heart-2025.jpg"
            }
        ];

        this.friends = [
            {
                name: "Rahul",
                quote: "The best prank master who fills our hearts with laughter 😂💖",
                description: "His jokes and pranks always light up our hearts and make every moment memorable!",
                avatar: "heart-avatar-rahul.jpg",
                heartColor: "#FF6B6B"
            },
            {
                name: "Aditi",
                quote: "Always fashionably late but brings sunshine to our hearts ⏰🌹",
                description: "May arrive fashionably late, but her warm heart and bright smile make it worth the wait!",
                avatar: "heart-avatar-aditi.jpg",
                heartColor: "#FF69B4"
            },
            {
                name: "Priya",
                quote: "Our memory keeper who captures hearts in every photo 📷💕",
                description: "With her loving eye for detail, she preserves all our precious heart-filled moments!",
                avatar: "heart-avatar-priya.jpg",
                heartColor: "#FFB6C1"
            },
            {
                name: "Arjun",
                quote: "The foodie who knows the way to our hearts 🍕❤️",
                description: "They say the way to the heart is through the stomach - Arjun proves this every day!",
                avatar: "heart-avatar-arjun.jpg",
                heartColor: "#DC143C"
            },
            {
                name: "Kavya",
                quote: "The caring soul with the biggest heart 💖🌹",
                description: "Always there with a warm hug and kind words when any of us needs love and support!",
                avatar: "heart-avatar-kavya.jpg",
                heartColor: "#FF1493"
            },
            {
                name: "Rohan",
                quote: "The adventurous spirit who opens our hearts to new experiences 🌟❤️",
                description: "Always ready for the next adventure and fills our hearts with excitement for life!",
                avatar: "heart-avatar-rohan.jpg",
                heartColor: "#CD5C5C"
            }
        ];

        this.galleryImages = [
            {src: "heart-gallery-1.jpg", caption: "Beach Hearts 2022 💕🌊"},
            {src: "heart-gallery-2.jpg", caption: "Birthday Love Fest 2023 🎂💖"},
            {src: "heart-gallery-3.jpg", caption: "Road Trip Adventures 🚗❤️"},
            {src: "heart-gallery-4.jpg", caption: "Movie Night Cuddles 🎬💕"},
            {src: "heart-gallery-5.jpg", caption: "Festival of Hearts 🎊💖"},
            {src: "heart-gallery-6.jpg", caption: "Study Squad Love 📚🌹"},
            {src: "heart-gallery-7.jpg", caption: "Beach Volleyball Hearts 🏐💕"},
            {src: "heart-gallery-8.jpg", caption: "Coffee & Heart-to-Hearts ☕❤️"},
            {src: "heart-gallery-9.jpg", caption: "Adventure Park Joy 🎢💖"},
            {src: "heart-gallery-10.jpg", caption: "Graduation Hearts 🎓🌹"},
            {src: "heart-gallery-11.jpg", caption: "New Year's Love 🎆💕"},
            {src: "heart-gallery-12.jpg", caption: "Picnic in Paradise 🌳❤️"}
        ];

        this.messages = [
            {
                name: "Anjali",
                message: "This page fills my heart with so much joy! Thank you for being the most amazing friends ever. You all have a special place in my heart forever! 💕🌹",
                timestamp: "2 days ago",
                hearts: 12
            },
            {
                name: "Rohan",
                message: "Looking at these memories makes my heart so full! Still can't believe how incredible our Goa trip was. My heart is already planning our next adventure! 🏖️❤️",
                timestamp: "1 week ago",
                hearts: 8
            },
            {
                name: "Sneha",
                message: "You guys are literally my chosen family and the keepers of my heart. Every moment with you fills my soul with pure love and happiness! 🥺💖🌹",
                timestamp: "2 weeks ago",
                hearts: 15
            }
        ];

        // Load user-added content from localStorage
        this.loadUserContent();
    }

    loadUserContent() {
        const savedMemories = localStorage.getItem('userTimelineMemories');
        const savedPhotos = localStorage.getItem('userGalleryImages');
        const savedMessages = localStorage.getItem('userMessages');

        if (savedMemories) {
            const userMemories = JSON.parse(savedMemories);
            this.timelineMemories = [...this.timelineMemories, ...userMemories];
        }

        if (savedPhotos) {
            const userPhotos = JSON.parse(savedPhotos);
            this.galleryImages = [...this.galleryImages, ...userPhotos];
        }

        if (savedMessages) {
            const userMessages = JSON.parse(savedMessages);
            this.messages = [...this.messages, ...userMessages];
        }
    }

    saveUserContent() {
        // Filter and save only user-added content
        const userMemories = this.timelineMemories.filter(memory => memory.userAdded);
        const userPhotos = this.galleryImages.filter(photo => photo.userAdded);
        const userMessages = this.messages.filter(message => message.userAdded);

        localStorage.setItem('userTimelineMemories', JSON.stringify(userMemories));
        localStorage.setItem('userGalleryImages', JSON.stringify(userPhotos));
        localStorage.setItem('userMessages', JSON.stringify(userMessages));
    }

    bindEvents() {
        // Navigation events
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for nav links
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        // Modal events
        const addTimelineBtn = document.getElementById('addTimelineBtn');
        const addGalleryBtn = document.getElementById('addGalleryBtn');
        const addStoryBtn = document.getElementById('addStoryBtn');

        if (addTimelineBtn) {
            addTimelineBtn.addEventListener('click', () => this.openModal('addMemoryModal'));
        }

        if (addGalleryBtn) {
            addGalleryBtn.addEventListener('click', () => this.openModal('addPhotoModal'));
        }

        if (addStoryBtn) {
            addStoryBtn.addEventListener('click', () => this.openModal('addMemoryModal'));
        }

        // Form events
        const memoryForm = document.getElementById('memoryForm');
        const photoForm = document.getElementById('photoForm');
        const messageForm = document.getElementById('messageForm');

        if (memoryForm) {
            memoryForm.addEventListener('submit', (e) => this.handleMemorySubmit(e));
        }

        if (photoForm) {
            photoForm.addEventListener('submit', (e) => this.handlePhotoSubmit(e));
        }

        if (messageForm) {
            messageForm.addEventListener('submit', (e) => this.handleMessageSubmit(e));
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Hero scroll button
        const heroScrollBtn = document.querySelector('.btn--hero');
        if (heroScrollBtn) {
            heroScrollBtn.addEventListener('click', () => {
                const timelineSection = document.getElementById('timeline');
                if (timelineSection) {
                    timelineSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start' 
                    });
                }
            });
        }
    }

    renderContent() {
        this.renderTimeline();
        this.renderGallery();
        this.renderFriends();
        this.renderMessages();
    }

    renderTimeline() {
        const container = document.getElementById('timeline-container');
        if (!container) return;

        // Sort memories by year
        const sortedMemories = this.timelineMemories.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        container.innerHTML = '';
        sortedMemories.forEach((memory, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.style.animationDelay = `${index * 0.2}s`;

            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-card">
                    <div class="timeline-year">${memory.year}</div>
                    <h3 class="timeline-title">${memory.title}</h3>
                    <p class="timeline-description">${memory.description}</p>
                </div>
            `;

            container.appendChild(timelineItem);
        });
    }

    renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;

        container.innerHTML = '';
        this.galleryImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.style.animationDelay = `${index * 0.1}s`;

            galleryItem.innerHTML = `
                <div class="gallery-placeholder">💕</div>
                <div class="gallery-overlay">
                    <p class="gallery-caption">${image.caption}</p>
                </div>
            `;

            // Add click handler for lightbox
            galleryItem.addEventListener('click', () => {
                this.openLightbox(image);
            });

            // Add proper hover effect
            galleryItem.addEventListener('mouseenter', () => {
                const overlay = galleryItem.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                this.createFloatingHeart(galleryItem, '#FF69B4');
            });

            galleryItem.addEventListener('mouseleave', () => {
                const overlay = galleryItem.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                }
            });

            container.appendChild(galleryItem);
        });
    }

    renderFriends() {
        const container = document.getElementById('friendsGrid');
        if (!container) return;

        container.innerHTML = '';
        this.friends.forEach((friend, index) => {
            const friendCard = document.createElement('div');
            friendCard.className = 'friend-card';
            friendCard.style.animationDelay = `${index * 0.1}s`;

            // Create heart animation on hover - only for friend cards
            friendCard.addEventListener('mouseenter', () => {
                this.createFloatingHeart(friendCard, friend.heartColor);
            });

            friendCard.innerHTML = `
                <div class="friend-avatar" style="background: linear-gradient(135deg, ${friend.heartColor} 0%, #FF1493 100%)">
                    💖
                </div>
                <h3 class="friend-name">${friend.name}</h3>
                <p class="friend-quote">${friend.quote}</p>
                <p class="friend-description">${friend.description}</p>
            `;

            container.appendChild(friendCard);
        });
    }

    renderMessages() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        // Sort messages by hearts (most liked first) and recency
        const sortedMessages = [...this.messages].sort((a, b) => {
            const heartsA = a.hearts || 0;
            const heartsB = b.hearts || 0;
            return heartsB - heartsA;
        });

        container.innerHTML = '';
        sortedMessages.forEach((message, index) => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.style.animationDelay = `${index * 0.1}s`;

            messageCard.innerHTML = `
                <div class="message-header">
                    <span class="message-author">${message.name}</span>
                    <span class="message-time">${message.timestamp}</span>
                </div>
                <p class="message-text">${message.message}</p>
                <div class="message-hearts">
                    <button class="heart-btn" onclick="app.addHeart(${index})">💖</button>
                    <span class="heart-count">${message.hearts || 0} hearts</span>
                </div>
            `;

            container.appendChild(messageCard);
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add heart animation to modal
            this.animateModalHearts(modal);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .lightbox');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = 'auto';
    }

    handleMemorySubmit(e) {
        e.preventDefault();
        
        const year = document.getElementById('memoryYear').value;
        const title = document.getElementById('memoryTitle').value;
        const description = document.getElementById('memoryDescription').value;

        if (year && title && description) {
            const newMemory = {
                year: year,
                title: title + ' 💖',
                description: description + ' 🌹✨',
                userAdded: true
            };

            this.timelineMemories.push(newMemory);
            this.saveUserContent();
            this.renderTimeline();
            this.closeModal('addMemoryModal');
            this.showHeartNotification('Memory added with love! 💖');
            
            // Reset form
            e.target.reset();
        }
    }

    handlePhotoSubmit(e) {
        e.preventDefault();
        
        const photoUrl = document.getElementById('photoUrl').value;
        const caption = document.getElementById('photoCaption').value;

        if (photoUrl && caption) {
            const newPhoto = {
                src: photoUrl,
                caption: caption + ' 💕',
                userAdded: true
            };

            this.galleryImages.push(newPhoto);
            this.saveUserContent();
            this.renderGallery();
            this.closeModal('addPhotoModal');
            this.showHeartNotification('Photo added with love! 🌹');
            
            // Reset form
            e.target.reset();
        }
    }

    handleMessageSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('messageName').value;
        const message = document.getElementById('messageText').value;

        if (name && message) {
            const newMessage = {
                name: name,
                message: message + ' 💕',
                timestamp: 'Just now',
                hearts: 0,
                userAdded: true
            };

            this.messages.unshift(newMessage); // Add to beginning
            this.saveUserContent();
            this.renderMessages();
            this.showHeartNotification('Love note sent! 💌');
            
            // Reset form
            e.target.reset();
        }
    }

    addHeart(messageIndex) {
        if (this.messages[messageIndex]) {
            this.messages[messageIndex].hearts = (this.messages[messageIndex].hearts || 0) + 1;
            this.saveUserContent();
            this.renderMessages();
            this.createHeartExplosion(event.target);
        }
    }

    openLightbox(image) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');

        if (lightbox && lightboxImage && lightboxCaption) {
            // Use placeholder for images
            lightboxImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2OUI0Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5KXPC90ZXh0Pgo8L3N2Zz4=';
            lightboxImage.alt = image.caption;
            lightboxCaption.textContent = image.caption;
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        this.closeAllModals();
    }

    initHeartCursor() {
        const heartCursor = document.getElementById('heartCursor');
        if (!heartCursor) return;

        document.addEventListener('mousemove', (e) => {
            const isOverInteractive = e.target.closest('button, a, .gallery-item, .friend-card, .message-card');
            
            if (isOverInteractive) {
                heartCursor.style.left = (e.clientX - 10) + 'px';
                heartCursor.style.top = (e.clientY - 10) + 'px';
                heartCursor.style.opacity = '1';
            } else {
                heartCursor.style.opacity = '0';
            }
        });
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe timeline items, gallery items, friend cards, and message cards
        setTimeout(() => {
            document.querySelectorAll('.timeline-item, .gallery-item, .friend-card, .message-card').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(50px)';
                item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(item);
            });
        }, 100);
    }

    createFloatingHeart(element, color = '#FF69B4') {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = '20px';
        heart.style.color = color;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';

        const rect = element.getBoundingClientRect();
        heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
        heart.style.top = rect.top + 'px';

        document.body.appendChild(heart);

        // Animate the heart
        heart.animate([
            { transform: 'translateY(0) scale(0.8)', opacity: 1 },
            { transform: 'translateY(-100px) scale(1.2)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => {
            heart.remove();
        };
    }

    createHeartExplosion(element) {
        const hearts = ['💖', '💕', '💗', '💘', '💝'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'absolute';
                heart.style.fontSize = '16px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';

                const rect = element.getBoundingClientRect();
                heart.style.left = rect.left + rect.width/2 + 'px';
                heart.style.top = rect.top + rect.height/2 + 'px';

                document.body.appendChild(heart);

                const angle = (360 / 8) * i;
                const distance = 50 + Math.random() * 30;

                heart.animate([
                    { 
                        transform: 'translate(0, 0) scale(0.5)', 
                        opacity: 1 
                    },
                    { 
                        transform: `translate(${Math.cos(angle * Math.PI/180) * distance}px, ${Math.sin(angle * Math.PI/180) * distance}px) scale(1.2)`, 
                        opacity: 0 
                    }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'ease-out'
                }).onfinish = () => {
                    heart.remove();
                };
            }, i * 50);
        }
    }

    animateModalHearts(modal) {
        const hearts = ['💖', '💕', '🌹', '✨'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'absolute';
                heart.style.fontSize = '24px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '3000';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '0%';
                heart.style.opacity = '0.7';

                modal.appendChild(heart);

                heart.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 0.7 },
                    { transform: 'translateY(-200px) rotate(360deg)', opacity: 0 }
                ], {
                    duration: 3000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                };
            }, i * 500);
        }
    }

    startHeartBurst() {
        const heartBurst = document.getElementById('heartBurst');
        if (!heartBurst) return;

        setInterval(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.fontSize = '20px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '0%';
            heart.style.pointerEvents = 'none';
            heart.style.opacity = '0.6';

            heartBurst.appendChild(heart);

            heart.animate([
                { transform: 'translateY(0) scale(0.5)', opacity: 0.6 },
                { transform: 'translateY(-300px) scale(1.5)', opacity: 0 }
            ], {
                duration: 4000 + Math.random() * 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                if (heart.parentNode) {
                    heart.remove();
                }
            };
        }, 1000);
    }

    showHeartNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = 'linear-gradient(135deg, #E91E63, #FFD700)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '25px';
        notification.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.4)';
        notification.style.zIndex = '4000';
        notification.style.fontFamily = "'Pacifico', cursive";
        notification.style.fontSize = '14px';
        notification.style.transform = 'translateX(300px)';
        notification.style.transition = 'transform 0.3s ease';

        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function closeModal(modalId) {
    app.closeModal(modalId);
}

function closeLightbox() {
    app.closeLightbox();
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FriendsMemoryApp();
});