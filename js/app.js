$('.animsition').animsition({
  inClass: 'fade-in',
  outClass: 'fade-out',
  inDuration: 700,
  outDuration: 500,
  loading: false,

});


$('#menu-button').click(function(){
  event.preventDefault();
  $('.nav--fullscreen').addClass('show');

});

$('#skills-btn').click(function(event){
  event.preventDefault();
  $('.is-collapsed').toggleClass('is-revealed');
  $('.btn span').toggleClass('is-rotated')

});
