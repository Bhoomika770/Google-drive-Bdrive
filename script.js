document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const splashScreen = document.getElementById('splash-screen');
    const loginPage = document.getElementById('login-page');
    const drivePage = document.getElementById('drive-page');
    const loginBtn = document.getElementById('login-btn');
    const fileUploadArea = document.getElementById('file-upload-area');
    const filesContainer = document.getElementById('files-container');
    const fileInput = document.getElementById('file-input');
    const hiddenFileInput = document.getElementById('hidden-file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const filePreview = document.getElementById('file-preview');
    const closePreview = document.getElementById('close-preview');
    const previewImage = document.getElementById('preview-image');
    const previewFilename = document.getElementById('preview-filename');
    const previewFilesize = document.getElementById('preview-filesize');
    const previewDate = document.getElementById('preview-date');
    const deleteFileBtn = document.getElementById('delete-file-btn');
    const toast = document.getElementById('toast-message');
    const toastText = document.getElementById('toast-text');

    // Demo files data
    let files = [
        {
            id: 1,
            name: 'Project Presentation.pdf',
            type: 'pdf',
            size: '2.4 MB',
            lastModified: 'Jun 12, 2023',
            thumbnail: 'https://via.placeholder.com/200x140/FF5733/FFFFFF?text=PDF'
        },
        {
            id: 2,
            name: 'Vacation Photo.jpg',
            type: 'image',
            size: '3.2 MB',
            lastModified: 'Jun 14, 2023',
            thumbnail: 'https://source.unsplash.com/random/200x140/?beach'
        },
        {
            id: 3,
            name: 'Monthly Report.xlsx',
            type: 'spreadsheet',
            size: '1.7 MB',
            lastModified: 'Jun 15, 2023',
            thumbnail: 'https://via.placeholder.com/200x140/33FF57/FFFFFF?text=XLSX'
        },
        {
            id: 4,
            name: 'Project Brief.docx',
            type: 'document',
            size: '1.2 MB',
            lastModified: 'Jun 16, 2023',
            thumbnail: 'https://via.placeholder.com/200x140/3357FF/FFFFFF?text=DOCX'
        },
        {
            id: 5,
            name: 'Team Photo.jpg',
            type: 'image',
            size: '4.5 MB',
            lastModified: 'Jun 18, 2023',
            thumbnail: 'https://source.unsplash.com/random/200x140/?team'
        },
        {
            id: 6,
            name: 'Project Timeline.pptx',
            type: 'presentation',
            size: '3.8 MB',
            lastModified: 'Jun 20, 2023',
            thumbnail: 'https://via.placeholder.com/200x140/FF33A8/FFFFFF?text=PPTX'
        }
    ];

    let currentFileId = null;

    // Show splash screen for 3 seconds then login page
    setTimeout(() => {
        splashScreen.classList.remove('active');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            loginPage.style.display = 'flex';
        }, 300);
    }, 3000);

    // Login button click
    loginBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if(email && password) {
            loginPage.style.display = 'none';
            drivePage.style.display = 'block';
            renderFiles();
            
            // Show toast message
            showToast("Successfully logged in!");

            // After 30 seconds, scroll to the files section
            setTimeout(() => {
                document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
                showToast("Here are your files!");
            }, 5000);
        } else {
            showToast("Please enter email and password!");
        }
    });

    // Render files
    function renderFiles() {
        filesContainer.innerHTML = '';
        
        files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.dataset.id = file.id;
            
            let iconClass = '';
            switch(file.type) {
                case 'pdf':
                    iconClass = 'fa-file-pdf';
                    break;
                case 'document':
                    iconClass = 'fa-file-word';
                    break;
                case 'spreadsheet':
                    iconClass = 'fa-file-excel';
                    break;
                case 'presentation':
                    iconClass = 'fa-file-powerpoint';
                    break;
                default:
                    iconClass = 'fa-file';
            }
            
            fileCard.innerHTML = `
                <div class="file-thumbnail">
                    ${file.type === 'image' ? 
                        `<img src="${file.thumbnail}" alt="${file.name}">` : 
                        `<i class="far ${iconClass}"></i>`
                    }
                    <div class="file-actions">
                        <button class="file-action-btn view-btn" data-id="${file.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="file-action-btn delete-btn" data-id="${file.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${file.lastModified} · ${file.size}</p>
                </div>
            `;
            
            filesContainer.appendChild(fileCard);
        });

        // Add event listeners to view and delete buttons
        const viewBtns = document.querySelectorAll('.view-btn');
        const deleteBtns = document.querySelectorAll('.delete-btn');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const fileId = parseInt(this.dataset.id);
                openFilePreview(fileId);
            });
        });
        
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const fileId = parseInt(this.dataset.id);
                deleteFile(fileId);
            });
        });

        // Add click event to file cards
        const fileCards = document.querySelectorAll('.file-card');
        fileCards.forEach(card => {
            card.addEventListener('click', function() {
                const fileId = parseInt(this.dataset.id);
                openFilePreview(fileId);
            });
        });
    }

    // Open file preview
    function openFilePreview(fileId) {
        const file = files.find(f => f.id === fileId);
        if (!file) return;
        
        currentFileId = fileId;
        
        // Update preview info
        previewFilename.textContent = file.name;
        previewFilesize.textContent = `Size: ${file.size}`;
        previewDate.textContent = `Uploaded: ${file.lastModified}`;
        
        // Set preview image
        if (file.type === 'image') {
            previewImage.src = file.thumbnail;
            previewImage.style.display = 'block';
        } else {
            // For non-image files, show placeholder
            previewImage.src = `https://via.placeholder.com/350x200/${getColorForFileType(file.type)}/FFFFFF?text=${file.type.toUpperCase()}`;
            previewImage.style.display = 'block';
        }
        
        // Show preview panel
        filePreview.classList.add('active');
    }

    // Get color for file type placeholder
    function getColorForFileType(type) {
        switch(type) {
            case 'pdf': return 'FF5733';
            case 'document': return '3357FF';
            case 'spreadsheet': return '33FF57';
            case 'presentation': return 'FF33A8';
            default: return '888888';
        }
    }

    // Close preview
    closePreview.addEventListener('click', function() {
        filePreview.classList.remove('active');
        currentFileId = null;
    });

    // Delete file
    function deleteFile(fileId) {
        // If the file is currently being previewed, close the preview
        if (currentFileId === fileId) {
            filePreview.classList.remove('active');
            currentFileId = null;
        }
        
        // Filter out the file to delete
        files = files.filter(file => file.id !== fileId);
        
        // Re-render the files
        renderFiles();
        
        // Show toast message
        showToast("File deleted successfully!");
    }

    // Delete button in preview
    deleteFileBtn.addEventListener('click', function() {
        if (currentFileId) {
            deleteFile(currentFileId);
        }
    });

    // Upload button click
    uploadBtn.addEventListener('click', function() {
        // Toggle file upload area
        if (fileUploadArea.style.display === 'none' || fileUploadArea.style.display === '') {
            fileUploadArea.style.display = 'block';
            fileUploadArea.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If already shown, trigger file input
            hiddenFileInput.click();
        }
    });

    // File upload area click
    fileUploadArea.addEventListener('click', function() {
        hiddenFileInput.click();
    });

    // File input change
    hiddenFileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const fileList = e.target.files;
            uploadFiles(fileList);
        }
    });

    // File upload handling (simulated)
    function uploadFiles(fileList) {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const fileId = files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1;
            
            let fileType = 'file';
            if (file.type.includes('image')) {
                fileType = 'image';
            } else if (file.type.includes('pdf')) {
                fileType = 'pdf';
            } else if (file.type.includes('word')) {
                fileType = 'document';
            } else if (file.type.includes('sheet') || file.type.includes('excel')) {
                fileType = 'spreadsheet';
            } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
                fileType = 'presentation';
            }
            
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const newFile = {
                id: fileId,
                name: file.name,
                type: fileType,
                size: formatFileSize(file.size),
                lastModified: formattedDate,
                thumbnail: fileType === 'image' ? URL.createObjectURL(file) : `https://via.placeholder.com/200x140/${getColorForFileType(fileType)}/FFFFFF?text=${file.name.split('.').pop().toUpperCase()}`
            };
            
            files.unshift(newFile);
        }
        
        // Hide file upload area
        fileUploadArea.style.display = 'none';
        
        // Re-render files
        renderFiles();
        
        // Show toast message
        showToast(`${fileList.length} file(s) uploaded successfully!`);
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Show toast message
    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Drag and drop handling
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.style.display = 'block';
        fileUploadArea.classList.add('drag-over');
    });

    fileUploadArea.addEventListener('dragleave', function() {
        fileUploadArea.classList.remove('drag-over');
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            uploadFiles(e.dataTransfer.files);
        }
    });

    // Initialize
    renderFiles();
});
