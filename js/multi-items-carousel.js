document.addEventListener("DOMContentLoaded", function () {
    var itemsMainDiv = ".MultiCarousel";
    var itemsDiv = ".MultiCarousel-inner";
    var itemWidth = "";
    var outerCarousel = document.getElementById("MultiCarousel");
    // var mcOuter = new Hammer(outerCarousel);
    var innerCarousels = document.querySelectorAll(".carousel");
    var startX, startY, endX, endY;

    $(".leftLst, .rightLst").click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition) click(0, this);
        else click(1, this);
    });
 
    ResCarouselSize();

    $(window).resize(function () {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() {
        var incno = 0;
        var dataItems = "data-items";
        var itemClass = ".item";
        var id = 0;
        var btnParentSb = "";
        var itemsSplit = "";
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $("body").width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(",");
            $(this)
                .parent()
                .attr("id", "MultiCarousel" + id);

            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            } else {
                incno = itemsSplit[0];
                itemWidth = (sampwidth / incno) - 20;
            }
            $(this).css({
                transform: "translateX(0px)",
                width: itemWidth * itemNumbers,
            });
            $(this)
                .find(itemClass)
                .each(function () {
                    $(this).outerWidth(itemWidth);
                });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");
        });
    }

    //this function used to move the items
    function ResCarousel(e, el, s) {
        var leftBtn = ".leftLst";
        var rightBtn = ".rightLst";
        var translateXval = "";
        var divStyle = $(el + " " + itemsDiv).css("transform");
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + " " + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + " " + leftBtn).addClass("over");
            }
        } else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + " " + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + " " + rightBtn).addClass("over");
            }
        }
        $(el + " " + itemsDiv).css(
            "transform",
            "translateX(" + -translateXval + "px)"
        );
    }

    //It is used to get some elements from btn
    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

    // Function to detect swipe direction
    function handleSwipe(direction) {
        if (direction === "left") {
            document.querySelector(".rightLst").click();
        } else if (direction === "right") {
            document.querySelector(".leftLst").click();
        }
    }

    // Add touch event listeners to the outer carousel
    outerCarousel.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });

    outerCarousel.addEventListener("touchmove", function (event) {
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
    });

    outerCarousel.addEventListener("touchend", function (event) {
        var deltaX = endX - startX;
        var deltaY = endY - startY;

        // Check if swipe is horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                handleSwipe("right");
            } else {
                handleSwipe("left");
            }
        }
    });

    // Add touch event listeners to the inner carousels to stop propagation
    innerCarousels.forEach(function (carousel) {
        carousel.addEventListener("touchstart", function (event) {
            event.stopPropagation();
        });
        carousel.addEventListener("touchmove", function (event) {
            event.stopPropagation();
        });
        carousel.addEventListener("touchend", function (event) {
            event.stopPropagation();
        });
    });
});
