// http://www.zachstronaut.com/posts/2009/01/18/jquery-smooth-scroll-bugs.html
var scrollElement = 'html, body';
$('html, body').each(function () {
var initScrollTop = $(this).attr('scrollTop');
$(this).attr('scrollTop', initScrollTop + 1);
if ($(this).attr('scrollTop') == initScrollTop + 1) {
scrollElement = this.nodeName.toLowerCase();
$(this).attr('scrollTop', initScrollTop);
return false;
}
});
var jSite = {
start: function(){
$('html').removeClass('no-js');
$('[rel=external]').attr('target','_blank');
jSite.attachShadowBox();
jSite.attachHome();
jSite.attachFeatureCarousel();
jSite.attachPortfolio();
jSite.attachPortfolioArticle();
jSite.attachServicesFeature();
jSite.attachStrategy();
jSite.attachConcept();
jSite.attachProductsFeature();
jSite.attachAbout();
jSite.attachCareers();
jSite.attachBlog();
jSite.attachContact();
jSite.attachSocialCarousel();
jSite.attachFooterValidation();
jSite.attachContactErrors();
jSite.attachEnlighten();
jSite.attachRateUs();
jSite.attachModalMessage();
$('#portfolio .navigation a:not(.view-all), .share .button').qtip({
content: {
attr: 'title'
},
position: {
my: 'bottom center',
at: 'top center'
},
show: {
effect: function() { $(this).stop().css({ 'opacity' : '1', 'margin-top' : '3px' } ).show().animate({ 'opacity' : '1', 'margin-top' : '0' }, 'fast'); }
},
style: {
classes: 'ui-tooltip-rounded ui-tooltip-graphite',
widget: false
}
})
//jSite.boneCollector();
},
attachHome: function() {
if ($('#home').length) {
TweenLite.set( $('#home .services .icon'), { css: { autoAlpha: 1 } } );
$("#home .services li").hover(
function () {
TweenLite.to($(this).find('.icon'), 0.25, { css: { top: -7 }, ease: Power3.easeInOut } );
return false;
},
function () {
TweenLite.to($(this).find('.icon'), 0.25, { css: { top: 0 }, ease: Power3.easeOut } );
return false;
}
);
$("#home .services li").click(function() {
window.open($(this).attr('data-url').replace('#', '#_'),'_self');
return false;
});
}
},
attachFooterValidation: function() {
$("#enlighten-subscribe").validationEngine();
},
attachFeatureCarousel: function() {
if (!$("#feature-carousel").length) return false;
$("#feature-carousel li").find("a").each(function(index, element) {
var $a = $(this);
$a.css('display', 'none');
$("#feature-carousel li").eq(index).find(".container").click(function(e) {
e.preventDefault();
window.open($a.attr('href'),'_self');
})
});
TweenLite.set( [$("#feature-carousel li").find(".image"),$("#feature-carousel li").find(".content")], { css: { alpha: 0 } } );
var $carousel = $("#feature-carousel");
$carousel.cycle({
activePagerClass: 'active',
after: function(currSlideElement, nextSlideElement, options, forwardFlag) {
$currItem = $(options.elements).eq(options.currSlide);
$currImage = $currItem.find('.image');
$currContent = $currItem.find('.content');
TweenLite.to($currImage, .75, { css: { alpha: 1 } } );
TweenLite.to($currContent, .25, { css: { alpha: 1 }, delay: .25 } );
TweenLite.from($currContent, .5, { css: { "right": "-100px" } } );
},
before: function(currSlideElement, nextSlideElement, options, forwardFlag) {
$oldItems = $(options.elements);
$oldImage = $oldItems.find('.image');
$oldContent = $oldItems.find('.content');
TweenLite.to($oldImage, .5, {css:{alpha:0} } );
TweenLite.to($oldContent, .5, {css:{alpha:0, "right": "57px" } } );
},
cleartype: true,
cleartypeNoBg: true,
fx: "fade",
next: "#feature-carousel-next",
pager: '#feature-carousel-pagination',
pagerAnchorBuilder: function(idx, slide) {
return $('#feature-carousel-pagination li').eq(idx);
},
pagerEvent: 'click',
//pause: 1,
//pauseOnPagerHover: 1,
prev: "#feature-carousel-prev",
speed: 1000,
timeout: 5000,
width: "100%"
});
},
attachPortfolio: function() {
var $container = $("#projects");
if (!$container.length) return false;
var $scroll = false;
var $currPage = 1;
var $numPages = $("#yoyo").find(".listing2_page:last").text();
var $filters = $("#filters");
$container.isotope({
itemSelector : '.element',
masonry : {
columnWidth : 336
},
masonryHorizontal : {
rowHeight: 244
},
cellsByRow : {
columnWidth : 336,
rowHeight : 244
},
cellsByColumn : {
columnWidth : 336,
rowHeight : 244
},
animationOptions: {
complete: function() {
if ($scroll) {
$(scrollElement).animate({
'scrollTop': $('#content').offset().top + 18
}, 500);
}
}
}
});
$filters = $('#filters li');
$filters.find('a').click(function(){
var $this = $(this);
var $selector = $this.attr('data-filter');
$scroll = true;
if ( $this.hasClass('selected') )
return false;
$filters.find('.selected').removeClass('selected');
$this.addClass('selected');
$container.isotope({ filter: $selector });
return false;
});
$('#content header').waypoint({
handler: function(event, direction) {
$("#container").toggleClass('sticky', direction === 'down');
event.stopPropagation();
},
offset: function() {
return 0;
}
});
/*
$(window).resize(function() {
$.waypoints('refresh')
});
*/
},
attachPortfolioArticle: function() {
if (!$('#portfolio-article').length) return false;
var $gallery = $('#portfolio-gallery-carousel');
var $galleryPagination = $('#portfolio-gallery-pagination');
var $galleryPrev = $('#portfolio-gallery-prev');
var $galleryNext = $('#portfolio-gallery-next');
$gallery.carouFredSel({
auto: {
play: false
},
height: "variable",
items: {
height: "variable",
visible: 1,
width: 642
},
pagination : {
container : $galleryPagination,
anchorBuilder : function(nr, item) {
return '<span></span>';
}
},
prev: $galleryPrev,
next: $galleryNext,
scroll: {
onAfter: function(oldItems, newItems, newSizes, animDuration) {
}
},
width: 642
});
},
attachServicesFeature: function() {
var $services = $('#feature .services');
var $servicesItems = $services.find('.service');
var $screen = $('#screens');
var $screens = $screen.find('.screen');
$servicesItems.hover(function(event) {
event.preventDefault();
var $index = $servicesItems.index($(this));
var $prev = $screen.find('.screen').eq($index).prevAll($(this));
var $theScreen = $screens.eq($index)
var $notScreens = $screens.not($screens.eq($index));
TweenLite.to($theScreen, 0.5, { css: { opacity: 1, top: parseInt($theScreen.attr('data-orig-y')) + "px" }, overwrite: "all" } );
if ($prev.length) {
$prev.each(function(index, element) {
TweenLite.to($(this), 0.5, { css: { opacity: 0, top: parseInt($(this).attr('data-orig-y')) - 300 + "px" }, overwrite: "all" } );
});
}
}, function(event) {
$screensReversed = $.makeArray($screens).reverse();
for (var i = 0; i < $screensReversed.length; i++) {
TweenLite.to($screensReversed[i], 0.5, { css: { opacity: 1, top: parseInt($($screensReversed[i]).attr('data-orig-y')) + "px" }, delay: 0 } );
}
});
$servicesItems.click( function(e) {
$scrollTo = $(this).attr("class").split(" ").slice(-1);
// quick
$multipliers = [];
$multipliers['one'] = 1;
$multipliers['two'] = 2;
$multipliers['three'] = 3;
$multipliers['four'] = 4;
$multipliers['five'] = 5;
if ($("section").hasClass($scrollTo)) {
$(scrollElement).animate({
'scrollTop': $("section." + $scrollTo).offset().top
}, ($multipliers[$scrollTo] * 500));
}
});
// quick
var $hash = window.location.hash.replace('#_', '#');
if ($($hash).length) {
$(scrollElement).animate({
'scrollTop': $($hash).offset().top
}, 500);
}
},
attachStrategy: function() {
var $strategy = $('#strategy-and-planning');
var $figure = $('#figure');
if (!$strategy.length) return false;
$('#strategy-and-planning ul').css('color', '#919398');
$('#strategy-and-planning li').wrapInner('<span />').find('span').css('color','#363c48');
},
attachConcept: function() {
if (!$('#beforeAfter').length) return false;
$('#beforeAfter').beforeAfter({
introPosition: 0.8,
dividerColor: "#ffffff"
});
},
attachProductsFeature: function() {
if (!$('#products').length) return false;
var $pager = $("#products .feature ul");
var $pagerItems = $pager.find('li');
var $products = $("#content .inner");
var $scrollRun = false;
if (!$pager.length || !$products.length) return false;
$products.cycle({
activePagerClass: 'active',
after: function(curr, next, opts, fwd) {
},
before: function(curr, next, opts, fwd) {
var $ht = $(this).height();
$(this).parent().animate({height: $ht});
// run after init
if ($scrollRun) {
$(scrollElement).animate({
'scrollTop': $('#content').offset().top - 70
}, 500);
} else {
$scrollRun = true;
}
},
cleartype: true,
cleartypeNoBg: true,
pager: $pager,
pagerAnchorBuilder: function(idx, slide) {
return $pagerItems.eq(idx);
},
pagerEvent: 'click',
speed: 500,
timeout: 0
});
if ($('.lt-ie7').length) {
$pagerItems.append('<span class="indicator"></span>');
}
$('#content').waypoint({
handler: function(event, direction) {
$(".feature").toggleClass('sticky', direction === 'down');
event.stopPropagation();
},
offset: function() {
return 70;
}
});
},
attachAbout: function() {
if (!$('#about').length) return false
$('#team').css('display', 'none');
$('#team-toggle').click(function(event) {
event.preventDefault();
$(this).toggleClass('active');
$('#team').slideToggle('slow');
});
$('#team-close').click(function(event) {
event.preventDefault();
$('#team').slideUp('slow');
$('#team-toggle').removeClass('active');
});
if ($('.lt-ie9').length) {
TweenLite.set($('#team .rotate-right'), { css: { rotation: 2 } } );
TweenLite.set($('#team .rotate-left'), { css: { rotation: -2 } } );
}
$('#content .three-quarters').easytabs({
animate: false,
tabs: $('.navigation-tabs li'),
updateHash: true
});
},
attachCareers: function() {
if (!$('#careers').length)
return false
TweenLite.set($('.is'), { css: { boxShadow: "", rotation: -3 } } );
$('#join-toggle').click(function() {
$(this).toggleClass('active');
if ($(this).hasClass('active')) {
TweenLite.to($(this).find('.indicator'), 0.25, { css: { top: 48 } } );
} else {
TweenLite.to($(this).find('.indicator'), 0.25, { css: { top: 36 } } );
}
$('#join').slideToggle('slow');
});
$('#talent select').selectmenu();
$('#talent-brief').customFileInput();
$('#talent').validationEngine({
position: "bottomLeft"
});
var $pager = $("#where ul");
var $pagerItems = $pager.find('li');
var $stats = $("#where figure");
if (!$pager.length || !$stats.length) return false;
$stats.cycle({
activePagerClass: 'active',
pager: $pager,
pagerAnchorBuilder: function(idx, slide) {
return $pagerItems.eq(idx);
},
pagerEvent: 'mouseover',
speed: 500,
timeout: 0
});
},
attachBlog: function() {
var $currPage = 1;
var $numPages = $("#blog-pagination").find(".listing2_page:last").text();
$('#content #primary .listing').infinitescroll({
animate : true,
navSelector : '#blog-pagination',
nextSelector : '#blog-pagination a',
itemSelector : "#content #primary .listing article",
//debug : true,
dataType : 'html',
prefill : true
// pathParse : function( pathStr, nextPage ){ return pathStr.replace('2', nextPage ); }
}, function(newElements) {
$currPage++;
if ($currPage == $numPages) {
$(window).unbind('.infscr');
}
});
},
attachContact: function() {
if (!$('.contact').length) return false;
$('select').selectmenu();
$('#talent-brief').customFileInput();
$('#hire-brief').customFileInput();
var styles = [
{
featureType: 'road.arterial',
elementType: 'geometry',
stylers: [
{ hue: '#aae0fa' },
{ saturation: -11 },
{ lightness: 23 },
{ visibility: 'on' }
]
},{
featureType: 'road.highway',
elementType: 'geometry',
stylers: [
{ hue: '#57b7df' },
{ saturation: -32 },
{ lightness: -5 },
{ visibility: 'on' }
]
},{
featureType: 'poi.park',
elementType: 'geometry',
stylers: [
{ hue: '#c5ccd3' },
{ saturation: -68 },
{ lightness: 9 },
{ visibility: 'simplified' }
]
},{
featureType: 'landscape',
elementType: 'all',
stylers: [
{ hue: '#dbdde3' },
{ saturation: -54 },
{ lightness: -2 },
{ visibility: 'off' }
]
},{
featureType: 'road.arterial',
elementType: 'labels',
stylers: [
{ hue: '#aae0fa' },
{ saturation: -11 },
{ lightness: 23 },
{ visibility: 'on' }
]
},{
featureType: 'road.highway',
elementType: 'labels',
stylers: [
{ hue: '#57b7df' },
{ saturation: -32 },
{ lightness: -5 },
{ visibility: 'on' }
]
},{
featureType: 'administrative.land_parcel',
elementType: 'all',
stylers: [
{ hue: '#0084b5' },
{ saturation: 100 },
{ lightness: -30 },
{ visibility: 'off' }
]
},{
featureType: 'poi',
elementType: 'all',
stylers: [
{ hue: '#0084b5' },
{ saturation: 100 },
{ lightness: -54 },
{ visibility: 'off' }
]
},{
featureType: 'poi.business',
elementType: 'all',
stylers: [
{ hue: '#0084b5' },
{ saturation: 100 },
{ lightness: -58 },
{ visibility: 'off' }
]
},{
featureType: 'water',
elementType: 'all',
stylers: [
{ hue: '#aab0b7' },
{ saturation: -82 },
{ lightness: -9 },
{ visibility: 'on' }
]
}
];
var map;
var point;
var mapBris;
var pointBris;
function initialize() {
var image = new google.maps.MarkerImage(
'/img/marker.png',
new google.maps.Size(53,74),
new google.maps.Point(0,0),
new google.maps.Point(27,74)
);
var shadow = new google.maps.MarkerImage(
'/img/marker-shadow.png',
new google.maps.Size(93,74),
new google.maps.Point(0,0),
new google.maps.Point(27,74)
);
var shape = {
coord: [29,0,35,1,37,2,40,3,41,4,43,5,44,6,45,7,46,8,47,9,48,10,48,11,49,12,49,13,50,14,50,15,50,16,51,17,51,18,51,19,51,20,51,21,51,22,52,23,52,24,52,25,51,26,51,27,51,28,51,29,51,30,51,31,50,32,50,33,50,34,49,35,49,36,49,37,48,38,48,39,47,40,47,41,46,42,46,43,45,44,45,45,44,46,44,47,43,48,43,49,42,50,42,51,41,52,41,53,40,54,40,55,39,56,38,57,38,58,37,59,37,60,36,61,36,62,35,63,34,64,34,65,33,66,32,67,32,68,31,69,31,70,30,71,29,72,29,73,22,73,22,72,21,71,21,70,20,69,19,68,19,67,18,66,17,65,17,64,16,63,16,62,15,61,14,60,14,59,13,58,13,57,12,56,12,55,11,54,10,53,10,52,9,51,9,50,8,49,8,48,7,47,7,46,6,45,6,44,5,43,5,42,4,41,4,40,3,39,3,38,3,37,2,36,2,35,1,34,1,33,1,32,0,31,0,30,0,29,0,28,0,27,0,26,0,25,0,24,0,23,0,22,0,21,0,20,0,19,0,18,0,17,1,16,1,15,1,14,2,13,2,12,3,11,4,10,4,9,5,8,6,7,7,6,8,5,10,4,12,3,14,2,16,1,22,0,29,0],
type: 'poly'
};
var mapOptions = {
center: new google.maps.LatLng(-37.816836,144.957094),
zoom: 15,
mapTypeId: 'Styled',
mapMarker: true,
//disableDoubleClickZoom: true,
mapTypeControl: false,
//navigationControl: false,
scrollControl: false,
scrollwheel: false,
streetViewControl: false
//zoomControl: false
};
map = new google.maps.Map(document.getElementById('map'), mapOptions);
point = new google.maps.LatLng(-37.816836,144.957094);
var marker = new google.maps.Marker({
clickable: false,
draggable: false,
raiseOnDrag: false,
icon: image,
shadow: shadow,
shape: shape,
map: map,
position: point
});
var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
map.mapTypes.set('Styled', styledMapType);
var mapBrisOptions = {
center: new google.maps.LatLng(-27.485586,152.993591),
zoom: 15,
mapTypeId: 'StyledBris',
mapMarker: true,
//disableDoubleClickZoom: true,
mapTypeControl: false,
//navigationControl: false,
scrollControl: false,
scrollwheel: false,
streetViewControl: false
//zoomControl: false
};
mapBris = new google.maps.Map(document.getElementById('map-bris'), mapBrisOptions);
pointBris = new google.maps.LatLng(-27.485586,152.993591);
var markerBris = new google.maps.Marker({
clickable: false,
draggable: false,
raiseOnDrag: false,
icon: image,
shadow: shadow,
shape: shape,
map: mapBris,
position: pointBris
});
var styledMapTypeBris = new google.maps.StyledMapType(styles, { name: 'StyledBris' });
mapBris.mapTypes.set('StyledBris', styledMapTypeBris);
}
initialize();
$mapButtons = $('.office').find('.button');
$('#maps').css('display','none');
$('#melbourne').css('display', 'none');
$('#brisbane').css('display','none');
var brisShown = false;
var melbShown = false;
$mapButtons.each(function(index, element) {
$(this).click(function(e) {
e.preventDefault();
if($('#maps').is(':hidden')) {
$('#maps-close').css('display', 'block');
$('#maps').slideDown('fast');
} else {
if ($(e.target).hasClass('active')) {
$('#maps').slideUp('fast', function() {
$('#maps-close').css('display', 'none');
$mapButtons.removeClass('active');
});
}
}
$mapButtons.removeClass('active');
$(this).addClass('active');
switch(e.target.id) {
case "melbourne-toggle" :
$('#melbourne').slideDown('fast');
$('#brisbane').slideUp('slow');
$("#melbourne").insertAfter("#brisbane");
if (!melbShown) {
google.maps.event.trigger(map, 'resize');
map.setCenter(point);
melbShown = true;
}
break;
case "brisbane-toggle" :
$('#brisbane').slideDown('fast');
$('#melbourne').slideUp('slow');
$("#brisbane").insertAfter("#melbourne");
if (!brisShown) {
google.maps.event.trigger(mapBris, 'resize');
mapBris.setCenter(pointBris);
brisShown = true;
}
break;
}
});
});
$('#maps-close').click(function(e) {
$('#maps').slideUp('fast', function() {
$('#maps-close').css('display', 'none');
$mapButtons.removeClass('active');
});
});
$('#content').easytabs({
animate: false,
tabs: $('#content header ul li'),
updateHash: true
});
$('#hire, #talent').validationEngine();
},
attachSocialCarousel: function() {
var $feeds = $("#contentinfo .feeds");
$feeds.cycle({
activePagerClass: 'active',
cleartype: true,
cleartypeNoBg: true,
pager: '#contentinfo .icons',
pagerAnchorBuilder: function(idx, slide) {
return $('#contentinfo .icons li').eq(idx);
},
pagerEvent: 'mouseover',
speed: 250,
timeout: 0
});
// Add back in the click events to open in new window
$('#contentinfo .icons li a').click(function () {
window.open(this.href);
});
},
// boneCollector: function() {
// $.ajax({
// url: "http://jira.brightlabs.com.au/s/en_UShzm0dc/782/15/1.2.4/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=e8bd168d",
// type: "get",
// cache: true,
// dataType: "script"
// });
// },
attachEnlighten: function() {
$("#enlighten-submit").on('click', function (e) {
e.preventDefault();
jSite.submitEnlighten($(this).parents().closest("form"));
});
$('#subscribe-enlighten-link').on('click', function (e) {
e.preventDefault();
var id = /(#.*)/i.exec(this)[0];
var errors = $(id).find('form').find('.formError');
if ( errors ) {
errors.remove();
}
Shadowbox.open({
/*title: 'Subscribe to Enlighten',*/
content: $(id).html(),
player: "html",
height: 300,
width: 530,
options: {
onFinish: function() {
$('#sb-player').find('.visuallyhidden').removeClass('visuallyhidden');
var form = $('#sb-player').find('form');
form.validationEngine('attach', {scroll: false});
form.find('#enlighten-submit').on('click', function (e) {
e.preventDefault();
jSite.submitEnlighten(form);
});
}
}
});
return false;
});
},
submitEnlighten: function(form) {
if ( !form.validationEngine('validate', {scroll: false}) ) {
return false;
}
if ( Shadowbox.isOpen() ) {
$('#sb-loading').css({
"display" : "block"
});
}
var url = form.attr("action");
var formData = form.serialize();
$.ajax({
url: url,
data: formData,
type: "POST",
dataType: "json",
success: function(data){
if ( data.success === "true" ) {
if ( Shadowbox.isOpen() ) {
$('#sb-loading').css({
'display' : 'none'
});
$("#sb-player.html").html("<div id='thankyou'><h2>Thank you!</h2><p>Thank you for subscribing to enlighten.</p></div>");
} else {
Shadowbox.open({
content: '<div id="thankyou"><h2>Thank you!</h2><p> Thank you for subscribing to enlighten.</p></div>',
player: 'html',
height: 300,
width: 530
});
}
setTimeout(function(){
Shadowbox.close();
}, 6000);
} else {
if ( Shadowbox.isOpen() ) {
form.css({
"display" : "none"
});
$('#sb-loading').css({
'display' : 'none'
});
form.siblings().css({"display" : "none"});
$("#sb-player.html").append("<div id='thankyou'><h2>Error!</h2><p>"+ data.message +"</p></div>");
setTimeout(function(){
form.css({
"display" : "block"
});
form.siblings().css({"display" : "block"});
$("#thankyou").remove();
}, 3000);
}
}
}
});
return false;
},
attachShadowBox: function() {
Shadowbox.init({
enableKeys:false
});
},
attachContactErrors: function() {
if( $(".form-error").length ) {
window.location.hash = "contact-enquiries";
}
},
attachRateUs: function() {
if( $("#rate-us").length ) {
$("#contact-yes").click( function() {
$( "#contact-details" ).css("display", "block");
$( "#nps" ).validationEngine();
});
$("#contact-no").click( function() {
$("#nps").validationEngine('detach');
$("#contact-details").css("display","none");
});
}
},
attachModalMessage: function() {
if ( $("#form-message").length ) {
setTimeout( function() {
Shadowbox.open( {
content: $("#form-message").html(),
player: 'html',
height: 300,
width: 530,
options: {
onFinish: function() {
setTimeout( function() {
Shadowbox.close();
}, 6000 );
}
}
} );
}, 1000);
}
}
} 