$(document).ready(function () {
  const amenityIds = {};

  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amenityIds[$(this).data('id')] = $(this).data('name');
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete amenityIds[$(this).data('id')];
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
    console.log(amenityIds);
  });
});
