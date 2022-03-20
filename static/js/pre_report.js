$('#section-image').hover(function(){
  $("#image-upload-icon").css("opacity", "1");
}, function(){
  $("#image-upload-icon").css("opacity", "0");
});

function readURL(input) {
    var Thisinput = $(input)
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        Thisinput.closest('.file-upload').find('.image-upload-wrap').hide();
  
        Thisinput.closest('.file-upload').find('.file-upload-image').attr('src', e.target.result);
        Thisinput.closest('.file-upload').find('#section-image').show();
  
        Thisinput.closest('.file-upload').find('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  }
  
  function removeUpload(input) {
    Thisinput.closest('.file-upload').find('.file-upload-input').replaceWith($('.file-upload-input').clone());
    Thisinput.closest('.file-upload').find('.file-upload-content').hide();
    Thisinput.closest('.file-upload').find('.image-upload-wrap').show();
  }
  Thisinput.closest('.file-upload').find('.image-upload-wrap').bind('dragover', function () {
          Thisinput.closest('.file-upload').find$('.image-upload-wrap').addClass('image-dropping');
      });
      Thisinput.closest('.file-upload').find('.image-upload-wrap').bind('dragleave', function () {
          Thisinput.closest('.file-upload').find('.image-upload-wrap').removeClass('image-dropping');
  });
  