document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("loading-screen").style.opacity = "0";
        document.getElementById("loading-screen").style.transition =
            "opacity 1s";
        setTimeout(function () {
            document.getElementById("loading-screen").style.display = "none";
            document.body.style.overflow = "auto";
            // document.body.style.width = "auto";

        }, 1000); // wait for the fade-out transition
    }, 3000); // 3 seconds delay for demonstration
});
