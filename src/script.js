async function downloadVideo() {
    const downloadButton = document.querySelector('.btn-success');
    const inputField = document.querySelector('.form-control');
    const url = inputField.value.trim();

    if (!url) {
        swal("Error", "Please input a valid url.", "error");
        return;
    }

    downloadButton.innerHTML = '<span style="font-size: 24px;">🔄</span> Please Wait...';

    try {
        const response = await fetch('https://2skx3t-8080.csb.app/main.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `url=${encodeURIComponent(url)}`
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            swal("Error", "Something went wrong.", "error");
            downloadButton.innerHTML = '<span style="font-size: 24px;">⬇️</span> Download Video';
            return;
        }

        const card = createCard(data);
        document.querySelector('.container').appendChild(card);
        downloadButton.innerHTML = '<span style="font-size: 24px;">⬇️</span> Download Video';

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        swal("Error", "Failed to fetch server response.", "error");
        downloadButton.innerHTML = '<span style="font-size: 24px;">⬇️</span> Download Video';
    }
}

function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card mt-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column align-items-center';

    const avatar = document.createElement('img');
    avatar.src = data.formats.avatar;
    avatar.className = 'rounded-circle mb-2';
    avatar.width = 100;
    avatar.height = 100;

    const creator = document.createElement('h5');
    creator.className = 'card-title mb-2';
    creator.textContent = data.formats.creator;

    const title = document.createElement('h6');
    title.className = 'card-subtitle mb-3 text-center text-muted';
    title.textContent = data.formats.basename;

    const videoBtn = document.createElement('a');
    videoBtn.href = data.formats.video[0].url;
    videoBtn.className = 'btn btn-primary mb-2'; 
    videoBtn.innerHTML = '<span style="font-size: 15px;">▶️</span> Download Video 1080p';

    const audioBtn = document.createElement('a');
    audioBtn.href = data.formats.audio[1].url;
    audioBtn.className = 'btn btn-secondary'; 
    audioBtn.innerHTML = '<span style="font-size: 15px;">🔊</span> Download Audio 128kbps';

    cardBody.appendChild(avatar);
    cardBody.appendChild(creator);
    cardBody.appendChild(title);
    cardBody.appendChild(videoBtn);
    cardBody.appendChild(audioBtn);

    card.appendChild(cardBody);

    return card;
}

document.querySelector('.btn-success').addEventListener('click', function(event) {
    event.preventDefault();
    downloadVideo();
});

document.querySelector('.form-control').addEventListener('input', function() {
    const clipboardButton = document.querySelector('.btn-primary');
    if (this.value !== '') {
        clipboardButton.innerHTML = '<span style="font-size: 15px;">❎</span>';
    } else {
        clipboardButton.innerHTML = '<span style="font-size: 15px;">📋</span>';
    }
});

document.querySelector('.btn-primary').addEventListener('click', function(event) {
    const clipboardButton = event.target.closest('.btn-primary');
    const inputField = document.querySelector('.form-control');

    if (clipboardButton.textContent.trim() === '📋') {
        navigator.clipboard.readText()
            .then(text => {
                inputField.value = text;
                clipboardButton.innerHTML = '<span style="font-size: 15px;">❎</span>';
            })
            .catch(err => {
                swal("Error", "Failed to read clipboard contents.", "error");
            });
    } else if (clipboardButton.textContent.trim() === '❎') {
        inputField.value = '';
        clipboardButton.innerHTML = '<span style="font-size: 15px;">📋</span>';
    }
});

