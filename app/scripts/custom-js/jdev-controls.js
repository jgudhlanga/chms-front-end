/* globals $*/
(function () {
    'use strict';
    $('document').ready(function () {
        $('#jdToggleLeft').click(function () {
            //hide all module titles
            $('span[id^=module]').addClass('jd-hide');
            //remove a tag padding
            $('ul.jd-nav li.jd-nav-li a').css({padding: '6px 0 0 10px'});
            // increase the icon size for a better visibility when the side bar is at mini view
            $('.jd-menu-icon').addClass('fa-2x');
            //resize the left side bar to 5%
            $('#jdSideBarLeft').animate({width: '5%'}).addClass('text-center');

            //resize the main section bar to 95%
            $('#jdMainSection').animate({width: '95%'});

            //hide this toggle left button
            $('#jdToggleLeft').hide();

            //show toggle right button
            $('#jdToggleRight').show();

        });

        $('#jdToggleRight').click(function () {

            //show all module titles
            $('span[id^=module]').removeClass('jd-hide');
            $('ul.jd-nav li.jd-nav-li a').css({padding: ''});
            //remove the fa-2x class
            $('.jd-menu-icon').removeClass('fa-2x');
            //remove the resizing on side bar and main section
            $('#jdSideBarLeft').animate({width: '11%'}).removeClass('text-center');
            $('#jdMainSection').animate({width: '89%'});
            //show the toggle let button
            $('#jdToggleLeft').show();

            //hide the toggle right button
            $('#jdToggleRight').hide();
        });
        if(window.innerWidth < 700){
            console.log('small screen');
        }
    });
}());
