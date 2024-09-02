document.addEventListener("DOMContentLoaded", () => {
    // Load YouTube IFrame API
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    var progressInterval;

    function onYouTubeIframeAPIReady() {
        // The player will be created dynamically when the video link is clicked
    }


    // Display mobile menu for navigation
    var siteMobileMenu = document.getElementById("site-mobile-menu");
    var siteMenutoggle = document.getElementById("site-menu-toggle");


    // Variables for the controls
    var videoLink = document.getElementById("videoLink");
    var popup = document.getElementById("popup");
    var overlay = document.getElementById("custome-overlay");
    var closePopup = document.getElementById("closePopup");
    var playPauseBtn = document.querySelector(".play-pause");
    var progressBar = document.querySelector(".progress-bar");
    var progressBarContainer = document.querySelector(
        ".progress-bar-container"
    );
    var timeDisplay = document.querySelector(".time-display");
    var fullscreenToggle = document.querySelector(".fullscreen-toggle");

    // Open the popup
    videoLink.addEventListener("click", function (event) {
        event.preventDefault();

        // Destroy the existing player if it exists
        if (player) {
            player.destroy();
            clearInterval(progressInterval); // Clear the interval associated with the old player
        }

        // Extract video ID from the href
        var videoUrl = videoLink.getAttribute("href");
        var videoId = videoUrl.split("v=")[1] || videoUrl.split("/").pop();

        // Create the YouTube player with the extracted video ID
        player = new YT.Player("player", {
            videoId: videoId,
            playerVars: {
                controls: 0,
                rel: 0,
                showinfo: 0,
                modestbranding: 1,
                iv_load_policy: 3,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });

        popup.style.display = "block";
        overlay.style.display = "block";
    });

    // Close the popup
    function closeVideoPopup() {
        popup.style.display = "none";
        overlay.style.display = "none";
        if (player) {
            player.pauseVideo();
            clearInterval(progressInterval); // Clear the interval when closing the popup
        }
    }

    if (closePopup) closePopup.addEventListener("click", closeVideoPopup);

    // Close the popup if the overlay is clicked
    overlay.addEventListener("click", closeVideoPopup);

    // Play/Pause toggle
    playPauseBtn.addEventListener("click", function () {
        if (!player) return;
        if (player.getPlayerState() == YT.PlayerState.PLAYING) {
            player.pauseVideo();
            playPauseBtn.textContent = "▶";
        } else {
            player.playVideo();
            playPauseBtn.textContent = "❚❚";
        }
    });

    // Update progress bar and time display
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            clearInterval(progressInterval); // Clear any previous intervals
            progressInterval = setInterval(updateProgressBar, 1000); // Set a new interval
        } else {
            clearInterval(progressInterval); // Clear the interval when the video is paused or ended
        }
    }

    function updateProgressBar() {
        if (!player) return;

        var currentTime = player.getCurrentTime();
        var duration = player.getDuration();
        var progress = (currentTime / duration) * 100;
        progressBar.style.width = progress + "%";

        var currentMinutes = Math.floor(currentTime / 60);
        var currentSeconds = Math.floor(currentTime % 60);
        var durationMinutes = Math.floor(duration / 60);
        var durationSeconds = Math.floor(duration % 60);

        timeDisplay.textContent =
            (currentMinutes < 10 ? "0" + currentMinutes : currentMinutes) +
            ":" +
            (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds) +
            " / " +
            (durationMinutes < 10 ? "0" + durationMinutes : durationMinutes) +
            ":" +
            (durationSeconds < 10 ? "0" + durationSeconds : durationSeconds);
    }

    // Fullscreen toggle
    fullscreenToggle.addEventListener("click", function () {
        var videoContainer = document.querySelector(".video-container");
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    function onPlayerReady(event) {
        updateProgressBar();
    }

    // Allow seeking by clicking on the progress bar
    progressBarContainer.addEventListener("click", function (event) {
        var rect = progressBarContainer.getBoundingClientRect();
        var clickPosition = event.clientX - rect.left;
        var containerWidth = progressBarContainer.offsetWidth;
        var clickPercentage = clickPosition / containerWidth;
        var videoDuration = player.getDuration();
        var seekTime = videoDuration * clickPercentage;
        player.seekTo(seekTime, true);
        updateProgressBar(); // Update the progress bar to reflect the new time
    });

    siteMenutoggle.addEventListener("click", function () {
        document.body.classList.toggle("activeNavBar")
        siteMenutoggle.classList.toggle("active");
        siteMobileMenu.classList.toggle("active");
    });
});
